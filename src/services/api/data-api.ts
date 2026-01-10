import type { Collection, FileItem } from '@/types/data';

export interface UploadFilesParams {
  files: File[];
  collectionId?: string;
  collectionName?: string;
}

export interface UploadFilesResult {
  collection: Collection;
  files: FileItem[];
}

export interface DataApi {
  getCollections(): Promise<Collection[]>;
  createCollection(name: string): Promise<Collection>;
  getFiles(collectionId: string): Promise<FileItem[]>;
  uploadFiles(params: UploadFilesParams): Promise<UploadFilesResult>;
  getViewfileLink(fileId: string, collectionName?: string): Promise<string>;
}
