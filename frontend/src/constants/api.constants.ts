
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  UPLOAD: '/documents/upload',
  DOCUMENTS: '/documents',
  DOCUMENT_BY_ID: (id: string) => `/documents/${id}`,
  FOLDERS: '/folders',
} as const;

export const API_TIMEOUT = 30000;

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown',
] as const;
