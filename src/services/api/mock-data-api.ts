import type { DataApi, UploadFilesParams, UploadFilesResult } from './data-api';
import type { Collection, FileItem } from '@/types/data';

const COLLECTIONS_KEY = 'mock_collections';
const FILES_KEY_PREFIX = 'mock_files_';

interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string; // ISO
  dataUrl: string; // persisted for view
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as any).randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function loadCollections(): Collection[] {
  const raw = localStorage.getItem(COLLECTIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCollections(cols: Collection[]) {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(cols));
}

function filesKey(collectionId: string) {
  return `${FILES_KEY_PREFIX}${collectionId}`;
}

function loadFiles(collectionId: string): StoredFile[] {
  const raw = localStorage.getItem(filesKey(collectionId));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveFiles(collectionId: string, files: StoredFile[]) {
  localStorage.setItem(filesKey(collectionId), JSON.stringify(files));
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export class MockDataApi implements DataApi {
  async getCollections(): Promise<Collection[]> {
    let cols = loadCollections();
    if (cols.length === 0) {
      // bootstrap a default collection for better UX
      const initial: Collection = { id: uuid(), name: 'Default', createdAt: new Date().toISOString() };
      cols = [initial];
      saveCollections(cols);
    }
    return cols;
  }

  async createCollection(name: string): Promise<Collection> {
    const cols = loadCollections();
    // if existed by name, return it
    const exist = cols.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exist) return exist;

    const col: Collection = { id: uuid(), name, createdAt: new Date().toISOString() };
    cols.push(col);
    saveCollections(cols);
    return col;
  }

  async getFiles(collectionId: string): Promise<FileItem[]> {
    const stored = loadFiles(collectionId);
    return stored.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      type: f.type,
      uploadDate: f.uploadDate,
      url: f.dataUrl, // expose data URL for mock viewing
    }));
  }

  async uploadFiles(params: UploadFilesParams): Promise<UploadFilesResult> {
    const { files, collectionId, collectionName } = params;
    if (!files || files.length === 0) {
      return Promise.reject(new Error('No files provided'));
    }

    // resolve collection
    let cols = loadCollections();
    let collection: Collection | undefined;

    if (collectionId) {
      collection = cols.find((c) => c.id === collectionId);
    }
    if (!collection && collectionName) {
      collection = cols.find((c) => c.name.toLowerCase() === collectionName.toLowerCase());
    }
    if (!collection && collectionName) {
      collection = { id: uuid(), name: collectionName, createdAt: new Date().toISOString() };
      cols.push(collection);
      saveCollections(cols);
    }
    if (!collection) {
      // fallback: ensure at least default exists
      cols = await this.getCollections();
      collection = cols[0];
    }

    const existing = loadFiles(collection.id);

    const newStored: StoredFile[] = [];
    for (const file of files) {
      const dataUrl = await fileToDataUrl(file);
      const stored: StoredFile = {
        id: uuid(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadDate: new Date().toISOString(),
        dataUrl,
      };
      newStored.push(stored);
    }

    const updated = [...newStored, ...existing];
    saveFiles(collection.id, updated);

    const resultFiles: FileItem[] = newStored.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      type: f.type,
      uploadDate: f.uploadDate,
      url: f.dataUrl,
    }));

    return { collection, files: resultFiles };
  }

  async getViewfileLink(fileId: string, collectionName?: string): Promise<string> {
    const cols = loadCollections();
    let targetColId: string | undefined;

    if (collectionName) {
      targetColId = cols.find((c) => c.name === collectionName)?.id;
    }

    // fallback: try all collections
    const colIds = targetColId ? [targetColId] : cols.map((c) => c.id);

    for (const colId of colIds) {
      const files = loadFiles(colId);
      const f = files.find((x) => x.id === fileId);
      if (f) return f.dataUrl;
    }
    throw new Error('File not found');
  }
}
