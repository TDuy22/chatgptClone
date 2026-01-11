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
        return data.map((item: string | { id?: string; name: string; createdAt?: string }, index: number) => {
          if (typeof item === 'string') {
            return { id: `col_${index}`, name: item, createdAt: new Date().toISOString() };
          }
          return {
            id: item.id || `col_${index}`,
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
   * POST /collections
   * Body: { name: "collection_name" } hoặc FormData { name }
   * Response: { id, name, createdAt }
   */
  async createCollection(name: string): Promise<Collection> {
    try {
      console.log('📂 Creating collection:', name);
      
      // Thử với JSON body trước
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.COLLECTIONS}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Collection created:', data);
      
      return {
        id: data.id || `col_${Date.now()}`,
        name: data.name || name,
        createdAt: data.createdAt || new Date().toISOString(),
      };
    } catch (error) {
      console.warn('⚠️ Backend POST /collections not available, using localStorage fallback:', error);
      return this.createCollectionInLocalStorage(name);
    }
  }

  /**
   * GET /collections/:name/files
   * Response: [{ id, name, size, type, uploadDate }]
   */
  async getFiles(collectionId: string): Promise<FileItem[]> {
    try {
      // Tìm collection name từ id
      const collections = await this.getCollections();
      const collection = collections.find(c => c.id === collectionId);
      const collectionName = collection?.name || collectionId;

      console.log('📄 Fetching files for collection:', collectionName);
      
      const response = await fetch(
        `${this.baseURL}${API_CONFIG.ENDPOINTS.COLLECTION_FILES}/${encodeURIComponent(collectionName)}/files`,
        {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Files from backend:', data);
      
      // Normalize response
      if (Array.isArray(data)) {
        return data.map((item: string | FileItem, index: number) => {
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
          return { ...item, collectionId };
        });
      }
      
      return [];
    } catch (error) {
      console.warn('⚠️ Backend /collections/:name/files not available, using localStorage fallback:', error);
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

    // Get or create collection
    let collection: Collection;
    if (collectionId) {
      const collections = await this.getCollections();
      const found = collections.find(c => c.id === collectionId);
      if (!found) {
        throw new Error(`Collection not found: ${collectionId}`);
      }
      collection = found;
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
      id: `col_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
    };

    collections.push(newCollection);
    localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
    
    return newCollection;
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
