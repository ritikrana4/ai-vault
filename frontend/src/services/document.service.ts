
import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../constants/api.constants';
import type { Document } from '../types';
import type {
  UploadDocumentResponse,
  GetDocumentResponse,
} from '../types/api.types';

export const uploadDocument = async (file: File, folderId: string | null = null): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  if (folderId !== null) {
    formData.append('folderId', folderId);
  }

  const response = await apiClient.post<UploadDocumentResponse>(
    API_ENDPOINTS.UPLOAD,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.document;
};

export const uploadDocuments = async (files: File[], folderId: string | null = null): Promise<Document[]> => {
  const uploadPromises = files.map((file) => uploadDocument(file, folderId));
  return Promise.all(uploadPromises);
};

export const getDocuments = async (folderId?: string | null): Promise<{ documents: Document[]; folders: any[] }> => {
  const params = folderId === undefined ? {} : { folderId: folderId ?? 'null' };
  const response = await apiClient.get<any>(API_ENDPOINTS.DOCUMENTS, { params });
  
  if (Array.isArray(response)) {
    return { documents: response, folders: [] };
  } else {
    return {
      documents: response.documents || [],
      folders: response.folders || [],
    };
  }
};

export const getDocument = async (id: string): Promise<GetDocumentResponse> => {
  return apiClient.get<GetDocumentResponse>(API_ENDPOINTS.DOCUMENT_BY_ID(id));
};

