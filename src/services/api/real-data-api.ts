import type { Collection, FileItem } from '@/types/data';
import type { DataApi, UploadFilesParams, UploadFilesResult } from './data-api';
import { API_CONFIG } from './config';

/**
 * Real Data API - Gọi backend thật
 * 
 * Backend endpoint: POST /indexing
 * Request: FormData với collection_name và files
 */
export class RealDataApi implements DataApi {
  private baseURL: string;
  
  // Local storage for collections (frontend-only management)
  private readonly COLLECTIONS_KEY = 'askify_collections';
  private readonly FILES_KEY_PREFIX = 'askify_files_';

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  // ============ Collection Management (Frontend-only) ============
  
  async getCollections(): Promise<Collection[]> {
    const raw = localStorage.getItem(this.COLLECTIONS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async createCollection(name: string): Promise<Collection> {
    const collections = await this.getCollections();
    
    // Check if collection already exists
    const existing = collections.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return existing;
    }

    const newCollection: Collection = {
      id: `col_${Date.now()}`,
      name: name,
      createdAt: new Date().toISOString(),
    };

    collections.push(newCollection);
    localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(collections));
    
    return newCollection;
  }

  async getFiles(collectionId: string): Promise<FileItem[]> {
    const raw = localStorage.getItem(`${this.FILES_KEY_PREFIX}${collectionId}`);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // ============ File Upload (Calls Backend) ============

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

    // Backend yêu cầu FormData
    const formData = new FormData();
    formData.append('collection_name', collection.name);
    
    // Append all files
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

      // Save files to local storage (for UI display)
      const fileItems: FileItem[] = files.map((file, index) => ({
        id: `file_${Date.now()}_${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        collectionId: collection.id,
      }));

      const existingFiles = await this.getFiles(collection.id);
      const allFiles = [...existingFiles, ...fileItems];
      localStorage.setItem(
        `${this.FILES_KEY_PREFIX}${collection.id}`,
        JSON.stringify(allFiles)
      );

      return {
        collection,
        files: fileItems,
      };

    } catch (error) {
      console.error('❌ Indexing API Error:', error);
      throw error;
    }
  }

  async getViewfileLink(fileId: string, collectionName?: string): Promise<string> {
    // TODO: Backend có endpoint xem file không?
    // Hiện tại trả về URL giả định
    return collectionName 
      ? `/uploads/${collectionName}/${fileId}`
      : `/uploads/${fileId}`;
  }
}
