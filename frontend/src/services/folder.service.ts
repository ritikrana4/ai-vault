
import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../constants/api.constants';
import type { CreateFolderResponse } from '../types/api.types';
import type { Folder } from '../types/index';

export const getFolders = async (): Promise<Folder[]> => {
  const response = await apiClient.get<any[]>(API_ENDPOINTS.FOLDERS);
  
  return response.map(folder => ({
    id: folder.id,
    name: folder.name,
    parentId: folder.parent_id || null,
  }));
};

export const createFolder = async (name: string, parentId: string | null = null): Promise<Folder> => {
  const response = await apiClient.post<CreateFolderResponse>(API_ENDPOINTS.FOLDERS, { 
    name,
    parent: parentId ?? null
  });
  
  return {
    id: response.folder.id,
    name: response.folder.name,
    parentId: response.folder.parent_id,
  };
};
