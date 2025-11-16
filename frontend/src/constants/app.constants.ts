export const APP_NAME = 'AI Document Vault';

export const FOLDER_NAMES = {
  ALL_FILES: 'All files',
} as const;

export const LABELS = {
  FOLDERS: 'Folders',
  UPLOAD: 'Upload',
  NEW_FOLDER: 'New folder',
  SEARCH: 'Search',
  CANCEL: 'Cancel',
  CLOSE: 'Close',
  CREATE_FOLDER: 'Create Folder',
  CREATING: 'Creating...',
  FOLDER_NAME: 'Folder Name',
  SUMMARY: 'Summary',
  MARKDOWN: 'Markdown',
  ORIGINAL: 'Original',
  BROWSE: 'browse',
} as const;

export const PLACEHOLDERS = {
  SEARCH_DOCUMENTS: 'Search documents...',
  ENTER_FOLDER_NAME: 'Enter folder name',
} as const;

export const TITLES = {
  CREATE_NEW_FOLDER: 'Create New Folder',
  AI_SUMMARY: 'AI Summary',
  MARKDOWN_VERSION: 'Markdown Version',
  ORIGINAL_FILE: 'Original File',
} as const;

export const MESSAGES = {
  LOADING_DOCUMENT: 'Loading document...',
  LOADING_DOCUMENTS: 'Loading documents...',
  NO_DOCUMENTS_FOUND: 'No documents found',
  NO_DOCUMENTS: 'No documents',
  DOCUMENT_NOT_FOUND: 'Document not found',
  DROP_FILES_HERE: 'Drop files here or',
  SUPPORTS_FILES: 'Supports: PDF, DOC, DOCX, TXT, MD (Max 50MB)',
  NO_SUMMARY_AVAILABLE: 'No summary available',
  NO_MARKDOWN_AVAILABLE: 'No markdown available',
  UPLOADING: 'Uploading',
  PROCESSING: 'Processing...',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  UPLOADED: 'uploaded',
  FILES_FAILED_TO_UPLOAD: 'failed to upload',
  CLOSE_UPLOAD_PROGRESS: 'Close upload progress',
} as const;

export const ERROR_MESSAGES = {
  FOLDER_NAME_EMPTY: 'Folder name cannot be empty',
  FOLDER_NAME_TOO_LONG: 'Folder name cannot exceed 50 characters',
  FOLDER_NAME_INVALID_CHARS: 'Folder name can only contain letters, numbers, spaces, hyphens, and underscores',
  FOLDER_DUPLICATE: (name: string) => `A folder named "${name}" already exists in this location`,
  FOLDER_CREATE_FAILED: 'Failed to create folder',
  DOCUMENT_LOAD_FAILED: 'Failed to load document',
  FILE_TYPE_NOT_SUPPORTED: (type: string) => `File type "${type}" is not supported. Please upload PDF, DOC, DOCX, TXT, or MD files.`,
  FILE_SIZE_EXCEEDS: (maxSizeMB: number) => `File size exceeds maximum allowed size of ${maxSizeMB}MB.`,
  SEARCH_QUERY_TOO_LONG: 'Search query cannot exceed 100 characters.',
  NETWORK_ERROR: 'No response from server. Please check your connection.',
  REQUEST_ERROR: 'An unexpected error occurred',
  USE_APP_ERROR: 'useApp must be used within AppProvider',
  ICON_NOT_FOUND: (name: string) => `Icon "${name}" not found in iconMap`,
} as const;

export const VALIDATION_LIMITS = {
  FOLDER_NAME_MAX_LENGTH: 50,
  SEARCH_QUERY_MAX_LENGTH: 100,
} as const;

export const STATUS_LABELS = {
  UPLOADING: 'Uploading...',
  PROCESSING: 'Processing...',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
} as const;

