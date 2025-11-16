
import { useState, useEffect, useCallback } from 'react';
import type { Document, APIError, Folder } from '../types';
import { getDocuments, uploadDocument as uploadDocumentAPI, uploadDocuments as uploadDocumentsAPI } from '../services/document.service';

interface UseDocumentsOptions {
  folderId?: string | null;
  autoFetch?: boolean;
}

interface UseDocumentsReturn {
  documents: Document[];
  folders: Folder[];
  loading: boolean;
  error: APIError | null;
  refetch: () => Promise<void>;
  uploadDocument: (file: File) => Promise<Document | null>;
  uploadDocuments: (files: File[]) => Promise<Document[]>;
}

export const useDocuments = (options: UseDocumentsOptions = {}): UseDocumentsReturn => {
  const { folderId, autoFetch = true } = options;
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<APIError | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getDocuments(folderId);
      setDocuments(result.documents);
      
      const transformedFolders = result.folders.map((f: any) => ({
        id: f.id,
        name: f.name,
        parentId: f.parent_id || null,
      }));
      setFolders(transformedFolders);
    } catch (err) {
      setError(err as APIError);
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  const uploadDocument = useCallback(
    async (file: File): Promise<Document | null> => {
      try {
        const doc = await uploadDocumentAPI(file, folderId ?? null);
        setDocuments((prev) => [doc, ...prev]);
        return doc;
      } catch (err) {
        setError(err as APIError);
        console.error('Error uploading document:', err);
        return null;
      }
    },
    [folderId]
  );

  const uploadDocuments = useCallback(
    async (files: File[]): Promise<Document[]> => {
      try {
        const docs = await uploadDocumentsAPI(files, folderId ?? null);
        setDocuments((prev) => [...docs, ...prev]);
        return docs;
      } catch (err) {
        setError(err as APIError);
        console.error('Error uploading documents:', err);
        return [];
      }
    },
    [folderId]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchDocuments();
    }
  }, [autoFetch, fetchDocuments]);

  return {
    documents,
    folders,
    loading,
    error,
    refetch: fetchDocuments,
    uploadDocument,
    uploadDocuments,
  };
};

