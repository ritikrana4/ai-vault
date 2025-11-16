
export interface Document {
  id: string;
  originalName: string;
  fileName: string;
  mimetype: string;
  size: number;
  uploadDate: string;
  summary: string;
  markdown: string;
  folderId: string | null;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface APIError {
  message: string;
  code?: string;
  statusCode?: number;
}
