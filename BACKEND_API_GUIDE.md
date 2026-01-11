# 📚 Hướng dẫn Backend - Askify API Integration

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [Cấu hình Frontend](#cấu-hình-frontend)
3. [Danh sách Endpoints](#danh-sách-endpoints)
4. [Chi tiết từng Endpoint](#chi-tiết-từng-endpoint)
5. [Ví dụ Code FastAPI](#ví-dụ-code-fastapi)
6. [CORS Configuration](#cors-configuration)
7. [Testing](#testing)

---

## Tổng quan

Frontend Askify sử dụng **Factory Pattern** để switch giữa Mock API (localStorage) và Real API (gọi backend).

### File cấu hình chính:
```
src/services/api/
├── config.ts          ← Cấu hình URL và endpoints
├── api-factory.ts     ← Switch Mock/Real
├── real-chat-api.ts   ← Gọi /qa endpoint
└── real-data-api.ts   ← Gọi /indexing, /collections endpoints
```

---

## Cấu hình Frontend

### Bước 1: Tạo file `.env` ở root folder

```env
# Tắt mock để dùng API thật
VITE_USE_MOCK=false

# URL của backend server
VITE_API_URL=http://localhost:8000
```

### Bước 2: Hoặc sửa trực tiếp `src/services/api/config.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://your-backend-server.com',  // ← THAY ĐỔI Ở ĐÂY
  
  ENDPOINTS: {
    QA: '/qa',
    INDEXING: '/indexing',
    COLLECTIONS: '/collections',
    COLLECTION_FILES: '/collections',
  },
};

// Đổi thành false để dùng Real API
export const USE_MOCK_API = false;  // ← THAY ĐỔI Ở ĐÂY
```

### Bước 3: Restart frontend

```bash
npm run dev
```

Console sẽ hiện:
```
🚀 Using RealChatApi
🚀 Using RealDataApi
```

---

## Danh sách Endpoints

### Bắt buộc (Core Features)

| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| `POST` | `/qa` | Hỏi đáp - nhận câu hỏi, trả về câu trả lời |
| `POST` | `/indexing` | Upload files để index vào collection |

### Tùy chọn (Có fallback localStorage nếu chưa có)

| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| `GET` | `/collections` | Lấy danh sách tất cả collections |
| `POST` | `/collections` | Tạo collection mới |
| `DELETE` | `/collections/:name` | Xóa một collection |
| `GET` | `/collections/:name/files` | Lấy danh sách files trong collection |

---

## Chi tiết từng Endpoint

### 1. POST `/qa` - Hỏi đáp (BẮT BUỘC)

**Mô tả:** Nhận câu hỏi từ user và collection name, trả về câu trả lời với citations.

**Request:**
- Content-Type: `multipart/form-data`
- Body:

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `collection_name` | string | Yes | Tên collection để tìm kiếm (có thể rỗng = tìm tất cả) |
| `question` | string | Yes | Câu hỏi của user |

**Response:** `application/json`

```json
[
  {
    "text": "Đây là nội dung trả lời đoạn 1...",
    "file_citation": ["document1.pdf", "report.docx"]
  },
  {
    "text": "Đây là nội dung trả lời đoạn 2...",
    "file_citation": ["data.xlsx"]
  }
]
```

**Lưu ý:**
- Response là một **Array** các objects
- Mỗi object có `text` (nội dung) và `file_citation` (danh sách file nguồn)
- `text` hỗ trợ **Markdown** (headings, bold, lists, tables, etc.)
- Frontend sẽ tự động render markdown và hiển thị citations

---

### 2. POST `/indexing` - Upload Files (BẮT BUỘC)

**Mô tả:** Upload một hoặc nhiều files vào một collection để index.

**Request:**
- Content-Type: `multipart/form-data`
- Body:

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `collection_name` | string | Yes | Tên collection để upload vào |
| `files` | File[] | Yes | Một hoặc nhiều files (PDF, DOCX, TXT, etc.) |

**Ví dụ FormData:**
```
------WebKitFormBoundary
Content-Disposition: form-data; name="collection_name"

tai-lieu-hoc-tap
------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="chapter1.pdf"
Content-Type: application/pdf

(binary data)
------WebKitFormBoundary
Content-Disposition: form-data; name="files"; filename="chapter2.pdf"
Content-Type: application/pdf

(binary data)
------WebKitFormBoundary--
```

**Response:** `application/json`

```json
{
  "success": true,
  "message": "Indexed 2 files successfully",
  "files_indexed": ["chapter1.pdf", "chapter2.pdf"]
}
```

**Lưu ý:**
- Frontend gửi **file thật** (binary), không phải chỉ tên file
- Có thể upload nhiều files cùng lúc (cùng field name `files`)
- Nên validate file size (config mặc định: max 50MB/file)

---

### 3. GET `/collections` - Lấy danh sách collections

**Mô tả:** Trả về danh sách tất cả collections có trong hệ thống.

**Request:** Không có body

**Response:** `application/json`

#### Response Schema:

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `id` | string | ❌ Optional | ID unique của collection. Nếu không có, frontend sẽ tự generate |
| `name` | string | ✅ **Required** | Tên collection (unique) |
| `createdAt` | string (ISO 8601) | ❌ Optional | Thời gian tạo. Nếu không có, frontend dùng thời gian hiện tại |

#### Các format được hỗ trợ:

**Format 1: Array of strings (đơn giản nhất)**
```json
["tai-lieu-hoc-tap", "bao-cao-tai-chinh", "hop-dong"]
```
→ Frontend sẽ tự convert thành objects với id và createdAt tự generate.

**Format 2: Array of objects (chỉ name)**
```json
[
  { "name": "tai-lieu-hoc-tap" },
  { "name": "bao-cao-tai-chinh" }
]
```

**Format 3: Array of objects (đầy đủ) - KHUYẾN NGHỊ**
```json
[
  {
    "id": "col_1",
    "name": "tai-lieu-hoc-tap",
    "createdAt": "2026-01-11T10:00:00Z"
  },
  {
    "id": "col_2", 
    "name": "bao-cao-tai-chinh",
    "createdAt": "2026-01-10T09:00:00Z"
  }
]
```

**Error Response:**
```json
{
  "error": "Database connection failed",
  "status": 500
}
```

---

### 4. POST `/collections` - Tạo collection mới

**Mô tả:** Tạo một collection mới trong hệ thống.

**Request:**
- Content-Type: `application/json`

#### Request Schema:

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `name` | string | ✅ **Required** | Tên collection muốn tạo (nên unique) |

**Request Body:**
```json
{
  "name": "collection-moi"
}
```

#### Response Schema:

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `id` | string | ❌ Optional | ID của collection vừa tạo |
| `name` | string | ✅ **Required** | Tên collection |
| `createdAt` | string (ISO 8601) | ❌ Optional | Thời gian tạo |

**Success Response (201 Created):**
```json
{
  "id": "col_123",
  "name": "collection-moi",
  "createdAt": "2026-01-11T12:00:00Z"
}
```

**Hoặc response tối thiểu:**
```json
{
  "name": "collection-moi"
}
```

**Error Response - Collection đã tồn tại (409 Conflict):**
```json
{
  "error": "Collection 'collection-moi' already exists",
  "status": 409
}
```

**Error Response - Validation (400 Bad Request):**
```json
{
  "error": "Collection name is required",
  "status": 400
}
```

---

### 5. DELETE `/collections/:name` - Xóa collection

**Mô tả:** Xóa một collection theo tên (bao gồm tất cả files trong đó).

**Request:**
- Method: `DELETE`
- URL: `/collections/{collection_name}`
- URL param: `name` = tên collection cần xóa (URL encoded nếu có ký tự đặc biệt)

**Ví dụ:** `DELETE /collections/tai-lieu-hoc-tap`

#### Response Schema:

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `success` | boolean | ✅ **Required** | `true` nếu xóa thành công |
| `message` | string | ❌ Optional | Thông báo chi tiết |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Collection 'tai-lieu-hoc-tap' deleted successfully"
}
```

**Hoặc response tối thiểu:**
```json
{
  "success": true
}
```

**Error Response - Không tìm thấy (404 Not Found):**
```json
{
  "success": false,
  "error": "Collection 'xyz' not found",
  "status": 404
}
```

---

### 6. GET `/collections/:name/files` - Lấy files trong collection

**Mô tả:** Trả về danh sách tất cả files đã upload trong một collection cụ thể.

**Request:**
- Method: `GET`  
- URL: `/collections/{collection_name}/files`
- URL param: `name` = tên collection

**Ví dụ:** `GET /collections/tai-lieu-hoc-tap/files`

#### Response Schema (mỗi file):

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `id` | string | ❌ Optional | ID unique của file |
| `name` | string | ✅ **Required** | Tên file (ví dụ: "document.pdf") |
| `size` | number | ❌ Optional | Kích thước file (bytes) |
| `type` | string | ❌ Optional | MIME type (ví dụ: "application/pdf") |
| `uploadDate` | string (ISO 8601) | ❌ Optional | Thời gian upload |

#### Các format được hỗ trợ:

**Format 1: Array of strings (đơn giản nhất)**
```json
["document.pdf", "report.docx", "data.xlsx"]
```

**Format 2: Array of objects (đầy đủ) - KHUYẾN NGHỊ**
```json
[
  {
    "id": "file_1",
    "name": "document.pdf",
    "size": 1024000,
    "type": "application/pdf",
    "uploadDate": "2026-01-11T10:30:00Z"
  },
  {
    "id": "file_2",
    "name": "report.docx", 
    "size": 512000,
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "uploadDate": "2026-01-11T11:00:00Z"
  }
]
```

**Empty collection:**
```json
[]
```

**Error Response - Collection không tồn tại (404):**
```json
{
  "error": "Collection 'xyz' not found",
  "status": 404
}
```

---

## Tóm tắt Required/Optional Fields

### Collection Object:
| Field | Required | Mô tả |
|-------|----------|-------|
| `name` | ✅ **BẮT BUỘC** | Tên collection, dùng làm identifier chính |
| `id` | ❌ Optional | Frontend tự generate nếu không có |
| `createdAt` | ❌ Optional | Frontend dùng `new Date().toISOString()` nếu không có |

### File Object:
| Field | Required | Mô tả |
|-------|----------|-------|
| `name` | ✅ **BẮT BUỘC** | Tên file |
| `id` | ❌ Optional | Frontend tự generate nếu không có |
| `size` | ❌ Optional | Hiển thị "Unknown" nếu không có |
| `type` | ❌ Optional | Default: "application/octet-stream" |
| `uploadDate` | ❌ Optional | Frontend dùng thời gian hiện tại nếu không có |

---

## Ví dụ Code FastAPI

```python
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import json

app = FastAPI()

# CORS - Cho phép frontend truy cập
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Models ============

class Answer(BaseModel):
    text: str
    file_citation: List[str]

class Collection(BaseModel):
    id: str
    name: str
    createdAt: str

class CreateCollectionRequest(BaseModel):
    name: str

# ============ In-memory storage (thay bằng database thật) ============

collections_db = {}
files_db = {}

# ============ Endpoints ============

@app.post("/qa")
async def qa(
    collection_name: str = Form(...),
    question: str = Form(...)
) -> List[Answer]:
    """
    Hỏi đáp - nhận câu hỏi, trả về câu trả lời với citations
    """
    print(f"📥 QA Request: collection={collection_name}, question={question}")
    
    # TODO: Thay bằng logic RAG thật
    # Ví dụ response:
    return [
        Answer(
            text=f"Đây là câu trả lời cho câu hỏi: **{question}**\n\nTrong collection: `{collection_name}`",
            file_citation=["document1.pdf", "document2.pdf"]
        ),
        Answer(
            text="Thông tin bổ sung:\n- Điểm 1\n- Điểm 2\n- Điểm 3",
            file_citation=["document3.pdf"]
        )
    ]


@app.post("/indexing")
async def indexing(
    collection_name: str = Form(...),
    files: List[UploadFile] = File(...)
):
    """
    Upload và index files vào collection
    """
    print(f"📥 Indexing Request: collection={collection_name}")
    
    indexed_files = []
    for file in files:
        print(f"   📄 File: {file.filename}, Size: {file.size}, Type: {file.content_type}")
        
        # Đọc file content
        content = await file.read()
        
        # TODO: Thay bằng logic indexing thật (embeddings, vector store, etc.)
        
        indexed_files.append(file.filename)
        
        # Reset file pointer nếu cần đọc lại
        await file.seek(0)
    
    # Lưu vào "database"
    if collection_name not in files_db:
        files_db[collection_name] = []
    files_db[collection_name].extend(indexed_files)
    
    return {
        "success": True,
        "message": f"Indexed {len(files)} files successfully",
        "files_indexed": indexed_files
    }


@app.get("/collections")
async def get_collections() -> List[Collection]:
    """
    Lấy danh sách tất cả collections
    """
    return list(collections_db.values())


@app.post("/collections")
async def create_collection(req: CreateCollectionRequest) -> Collection:
    """
    Tạo collection mới
    """
    from datetime import datetime
    
    collection = Collection(
        id=f"col_{len(collections_db) + 1}",
        name=req.name,
        createdAt=datetime.now().isoformat()
    )
    collections_db[req.name] = collection
    
    return collection


@app.delete("/collections/{name}")
async def delete_collection(name: str):
    """
    Xóa collection
    """
    if name in collections_db:
        del collections_db[name]
    if name in files_db:
        del files_db[name]
    
    return {"success": True, "message": f"Collection '{name}' deleted"}


@app.get("/collections/{name}/files")
async def get_collection_files(name: str):
    """
    Lấy danh sách files trong collection
    """
    if name in files_db:
        return files_db[name]
    return []


# Run với: uvicorn main:app --reload --port 8000
```

---

## CORS Configuration

**Quan trọng:** Backend cần cho phép CORS từ frontend.

### FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative port
        "https://your-production-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Flask:
```python
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": "*"}})
```

### Express.js:
```javascript
const cors = require('cors');
app.use(cors({ origin: ['http://localhost:5173'] }));
```

---

## Testing

### 1. Test với cURL

```bash
# Test QA
curl -X POST http://localhost:8000/qa \
  -F "collection_name=test" \
  -F "question=Hello world"

# Test Upload
curl -X POST http://localhost:8000/indexing \
  -F "collection_name=test" \
  -F "files=@document.pdf" \
  -F "files=@report.docx"

# Test Get Collections
curl http://localhost:8000/collections

# Test Create Collection
curl -X POST http://localhost:8000/collections \
  -H "Content-Type: application/json" \
  -d '{"name": "new-collection"}'
```

### 2. Check Frontend Console

Khi gọi API thành công:
```
🚀 Calling QA API: {url: "http://localhost:8000/qa", collection_name: "test", question: "Hello"}
✅ QA API Response: [{text: "...", file_citation: [...]}]
```

Khi có lỗi:
```
❌ QA API Error: 500 - Internal Server Error
```

Khi fallback về localStorage:
```
⚠️ Backend /collections not available, using localStorage fallback
```

---

## Checklist cho Backend Team

- [ ] Cấu hình CORS cho phép frontend domain
- [ ] Implement `POST /qa` với FormData input
- [ ] Implement `POST /indexing` với file upload
- [ ] (Optional) Implement `GET /collections`
- [ ] (Optional) Implement `POST /collections`
- [ ] (Optional) Implement `GET /collections/:name/files`
- [ ] Test với cURL hoặc Postman
- [ ] Thông báo Frontend team URL backend để update `.env`

---

## Liên hệ

Nếu có thắc mắc về format request/response, vui lòng check:
- File `src/services/api/real-chat-api.ts` - Logic gọi QA API
- File `src/services/api/real-data-api.ts` - Logic gọi Data APIs
- File `src/services/api/config.ts` - Cấu hình endpoints
