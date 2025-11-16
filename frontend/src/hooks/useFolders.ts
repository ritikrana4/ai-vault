
import { useState, useEffect, useCallback } from 'react';
import { getFolders as getFoldersAPI, createFolder as createFolderAPI } from '../services/folder.service';
import type { APIError, Folder } from '../types/index';

interface UseFoldersReturn {
  folders: Folder[];
  loading: boolean;
  error: APIError | null;
  refetch: () => Promise<void>;
  createFolder: (name: string, parentId?: string | null) => Promise<Folder | null>;
  getFolderById: (id: string) => Folder | null;
}

export const useFolders = (): UseFoldersReturn => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<APIError | null>(null);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const folderList = await getFoldersAPI();
      setFolders(folderList);
    } catch (err) {
      setError(err as APIError);
      console.error('Error fetching folders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = useCallback(async (name: string, parentId: string | null = null): Promise<Folder | null> => {
    try {
      const newFolder = await createFolderAPI(name, parentId);
      setFolders((prev) => [...prev, newFolder]);
      return newFolder;
    } catch (err) {
      setError(err as APIError);
      console.error('Error creating folder:', err);
      return null;
    }
  }, []);

  const getFolderById = useCallback((id: string): Folder | null => {
    return folders.find(f => f.id === id) || null;
  }, [folders]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    loading,
    error,
    refetch: fetchFolders,
    createFolder,
    getFolderById,
  };
};
