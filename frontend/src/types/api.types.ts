
import type { Document } from './index';

export interface UploadDocumentResponse {
  success: boolean;
  document: Document;
}

export interface CreateFolderResponse {
  success: boolean;
  folder: {
    id: string;
    name: string;
    parent_id: string | null;
  };
}

export interface GetDocumentResponse extends Document {
  fileContent?: string;
}
