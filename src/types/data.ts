export interface Collection {
  id: string;
  name: string;
  createdAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string; // ISO string
  url?: string; // data URL or http URL (when backend available)
}
