import type { Collection, FileItem } from '@/types/data';
import type { DataApi, UploadFilesParams, UploadFilesResult } from './data-api';
import { API_CONFIG } from './config';

/**
 * Real Data API - Gọi backend thật
 * 
 * Endpoints:
 * - GET  /collections           → Lấy danh sách collections
 * - POST /collections           → Tạo collection mới (body: { name })
 * - DELETE /collections/:name   → Xóa collection
 * - GET /collections/:name/files → Lấy files trong collection
 * - POST /indexing              → Upload files (FormData: collection_name, files[])
 * 
 * Nếu backend chưa có endpoint nào, sẽ fallback về localStorage
 */
export class RealDataApi implements DataApi {
  private baseURL: string;
  
  // Fallback to localStorage if backend endpoint doesn't exist
  private readonly COLLECTIONS_KEY = 'askify_collections';
  private readonly FILES_KEY_PREFIX = 'askify_files_';

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  // ============ Collection Management ============
  
  /**
   * GET /collections
   * Response: [{ id, name, createdAt }]
   */
  async getCollections(): Promise<Collection[]> {
    try {
      console.log('📂 Fetching collections from:', `${this.baseURL}${API_CONFIG.ENDPOINTS.COLLECTIONS}`);
      
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.COLLECTIONS}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Collections from backend:', data);
      
      // Backend có thể trả về format khác, normalize về Collection[]
      // Giả sử backend trả về: [{ name: "col1" }, { name: "col2" }]
      // hoặc: ["col1", "col2"]
      // hoặc: [{ id: "1", name: "col1", createdAt: "..." }]
      
      if (Array.isArray(data)) {
        return data.map((item: string | { id?: string; name: string; createdAt?: string }) => {
          if (typeof item === 'string') {
            // name làm id luôn
            return { id: item, name: item, createdAt: new Date().toISOString() };
          }
          // Dùng name làm id nếu backend không trả về id
          return {
            id: item.name,  // Dùng name làm id
            name: item.name,
            createdAt: item.createdAt || new Date().toISOString(),
          };
        });
      }
      
      return [];
    } catch (error) {
      console.warn('⚠️ Backend /collections not available, using localStorage fallback:', error);
      return this.getCollectionsFromLocalStorage();
    }
  }

  /**
   * POST /create_collection?name={collection_name}
   * Response: { status: "success" }
   */
  async createCollection(name: string): Promise<Collection> {
    try {
      console.log('📂 Creating collection:', name);
      
      // Backend sử dụng query parameter: POST /create_collection?name=xxx
      const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.CREATE_COLLECTION}?name=${encodeURIComponent(name)}`;
      console.log('📂 URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Collection created:', data);
      
      // Backend trả về { status: "success" }
      // Frontend tạo Collection object - dùng name làm id
      const newCollection: Collection = {
        id: name,  // Dùng name làm id
        name: name,
        createdAt: new Date().toISOString(),
      };
      
      // Lưu vào localStorage để sync
      this.saveCollectionToLocalStorage(newCollection);
      
      return newCollection;
    } catch (error) {
      console.warn('⚠️ Backend POST /create_collection not available, using localStorage fallback:', error);
      return this.createCollectionInLocalStorage(name);
    }
  }

  /**
   * GET /collections_info?name={collection_name}
   * Response: { files: [{ id, name, size, type, uploadDate }], ... } hoặc [{ name, ... }]
   */
  async getFiles(collectionId: string): Promise<FileItem[]> {
    try {
      // collectionId bây giờ chính là name
      const collectionName = collectionId;

      // Build URL with query parameter: /collections_info?name=collection_name
      const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.COLLECTION_INFO}?name=${encodeURIComponent(collectionName)}`;
      
      console.log('📄 Fetching files for collection:', collectionName);
      console.log('📄 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Collection info from backend:', data);
      
      // Backend có thể trả về:
      // 1. { files: [...] } - Object với field files
      // 2. [...] - Array trực tiếp
      // 3. { documents: [...] } - Object với field documents
      
      let filesData: unknown[] = [];
      
      if (Array.isArray(data)) {
        filesData = data;
      } else if (data && typeof data === 'object') {
        // Tìm field chứa danh sách files
        filesData = data.files || data.documents || data.items || [];
      }
      
      // Normalize response
      if (Array.isArray(filesData)) {
        return filesData.map((item: unknown, index: number) => {
          if (typeof item === 'string') {
            return {
              id: `file_${index}`,
              name: item,
              size: 0,
              type: 'application/octet-stream',
              uploadDate: new Date().toISOString(),
              collectionId,
            };
          }
          const fileItem = item as FileItem;
          return { ...fileItem, collectionId };
        });
      }
      
      return [];
    } catch (error) {
      console.warn('⚠️ Backend /collections_info not available, using localStorage fallback:', error);
      return this.getFilesFromLocalStorage(collectionId);
    }
  }

  // ============ File Upload ============

  /**
   * POST /indexing
   * FormData: { collection_name, files[] }
   */
  async uploadFiles(params: UploadFilesParams): Promise<UploadFilesResult> {
    const { files, collectionId, collectionName } = params;

    // Get or create collection - collectionId bây giờ chính là name
    let collection: Collection;
    if (collectionId) {
      // collectionId chính là name, tìm theo name
      const collections = await this.getCollections();
      const found = collections.find(c => c.name === collectionId || c.name.toLowerCase() === collectionId.toLowerCase());
      if (!found) {
        // Nếu không tìm thấy, tạo collection object từ collectionId (name)
        collection = {
          id: collectionId,
          name: collectionId,
          createdAt: new Date().toISOString(),
        };
      } else {
        collection = found;
      }
    } else if (collectionName) {
      collection = await this.createCollection(collectionName);
    } else {
      throw new Error('Either collectionId or collectionName is required');
    }

    console.log('🚀 Calling Indexing API:', {
      url: `${this.baseURL}${API_CONFIG.ENDPOINTS.INDEXING}`,
      collection_name: collection.name,
      files: files.map(f => f.name)
    });

    const formData = new FormData();
    formData.append('collection_name', collection.name);
    
    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.INDEXING}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Indexing API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Indexing API Response:', result);

      // Create file items for UI
      const fileItems: FileItem[] = files.map((file, index) => ({
        id: `file_${Date.now()}_${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        collectionId: collection.id,
      }));

      // Save to localStorage as cache for display
      this.saveFilesToLocalStorage(collection.id, fileItems);

      return { collection, files: fileItems };

    } catch (error) {
      console.error('❌ Indexing API Error:', error);
      throw error;
    }
  }

  async getViewfileLink(fileId: string, collectionName?: string): Promise<string> {
    // TODO: Backend có thể cung cấp endpoint: GET /files/:fileId/download
    return collectionName 
      ? `${this.baseURL}/files/${collectionName}/${fileId}`
      : `${this.baseURL}/files/${fileId}`;
  }

  // ============ LocalStorage Fallback Methods ============
  
  private getCollectionsFromLocalStorage(): Collection[] {
    const raw = localStorage.getItem(this.COLLECTIONS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private createCollectionInLocalStorage(name: string): Collection {
    const collections = this.getCollectionsFromLocalStorage();
    
    const existing = collections.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;

    const newCollection: Collection = {
      id: name,  // Dùng name làm id
      name,
      createdAt: new Date().toISOString(),
    };

    collections.push(newCollection);
    localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
    
    return newCollection;
  }

  private saveCollectionToLocalStorage(collection: Collection): void {
    const collections = this.getCollectionsFromLocalStorage();
    
    // Check if already exists
    const existingIndex = collections.findIndex(c => c.name.toLowerCase() === collection.name.toLowerCase());
    if (existingIndex >= 0) {
      collections[existingIndex] = collection;
    } else {
      collections.push(collection);
    }
    
    localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
  }

  private getFilesFromLocalStorage(collectionId: string): FileItem[] {
    const raw = localStorage.getItem(`${this.FILES_KEY_PREFIX}${collectionId}`);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveFilesToLocalStorage(collectionId: string, newFiles: FileItem[]): void {
    const existingFiles = this.getFilesFromLocalStorage(collectionId);
    const allFiles = [...existingFiles, ...newFiles];
    localStorage.setItem(`${this.FILES_KEY_PREFIX}${collectionId}`, JSON.stringify(allFiles));
  }
}
