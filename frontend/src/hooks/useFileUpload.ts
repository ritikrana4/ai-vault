
import { useState, useCallback } from 'react';
import type { UploadProgress } from '../types';
import { validateFile } from '../utils/validation.utils';
import { STATUS_LABELS } from '../constants/app.constants';

interface UseFileUploadReturn {
  uploads: UploadProgress[];
  uploadFiles: (files: File[], uploadFn: (file: File) => Promise<any>) => Promise<void>;
  clearUploads: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const uploadFiles = useCallback(
    async (files: File[], uploadFn: (file: File) => Promise<any>) => {
      const validFiles: File[] = [];
      const invalidFiles: UploadProgress[] = [];

      Array.from(files).forEach((file) => {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          invalidFiles.push({
            fileName: file.name,
            progress: 0,
            status: 'error',
            error: validation.error,
          });
        }
      });

      const validFileUploads: UploadProgress[] = validFiles.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: 'uploading',
      }));

      setUploads((prev) => [...prev, ...invalidFiles, ...validFileUploads]);

      const uploadPromises = validFiles.map(async (file) => {
        try {
          setUploads((prev) =>
            prev.map((u) =>
              u.fileName === file.name ? { ...u, progress: 50, status: 'processing' as const } : u
            )
          );

          await uploadFn(file);

          setUploads((prev) =>
            prev.map((u) =>
              u.fileName === file.name ? { ...u, progress: 100, status: 'completed' as const } : u
            )
          );
        } catch (error) {
          setUploads((prev) =>
            prev.map((u) =>
              u.fileName === file.name
                ? {
                    ...u,
                    status: 'error' as const,
                    error: error instanceof Error ? error.message : STATUS_LABELS.FAILED,
                  }
                : u
            )
          );
        }
      });

      await Promise.all(uploadPromises);
    },
    []
  );

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  return {
    uploads,
    uploadFiles,
    clearUploads,
  };
};

