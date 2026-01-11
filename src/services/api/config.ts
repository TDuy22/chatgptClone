/**
 * API Configuration
 * 
 * Backend team cần cung cấp các endpoints sau:
 * 
 * 1. QA (Hỏi đáp):
 *    POST /qa
 *    - Request: FormData { collection_name, question }
 *    - Response: [{ text, file_citation }]
 * 
 * 2. INDEXING (Upload files):
 *    POST /indexing
 *    - Request: FormData { collection_name, files[] }
 *    - Response: { success, message }
 * 
 * 3. COLLECTIONS (Quản lý collections):
 *    GET  /collections          - Lấy danh sách collections
 *    POST /collections          - Tạo collection mới
 *    DELETE /collections/:name  - Xóa collection
 * 
 * 4. FILES (Quản lý files trong collection):
 *    GET /collections_info?name={name} - Lấy thông tin collection và files
 */

export const API_CONFIG = {
  // TODO: Thay đổi khi có URL backend thật
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  ENDPOINTS: {
    // QA endpoint - Hỏi đáp
    QA: '/qa',
    
    // Indexing endpoint - Upload files
    INDEXING: '/indexing',
    
    // Collection endpoints
    COLLECTIONS: '/collections',           // GET: list, POST: create
    COLLECTION_DELETE: '/collections',     // DELETE /collections/:name
    
    // Files endpoint - GET /collections_info?name={name}
    COLLECTION_INFO: '/collections_info',
  },
  
  // Timeout cho requests (ms)
  TIMEOUT: 60000, // 60 seconds cho QA vì có thể mất thời gian xử lý
  
  // Max file size (bytes)
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
};

/**
 * Kiểm tra có đang dùng mock hay không
 * Set VITE_USE_MOCK=false trong .env để dùng real API
 */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK !== 'false';
