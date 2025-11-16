
import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal/Modal';
import type { Folder } from '../../types/index';
import { LABELS, PLACEHOLDERS, TITLES, ERROR_MESSAGES, VALIDATION_LIMITS } from '../../constants/app.constants';

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => Promise<void>;
  existingFolders: Folder[];
  currentFolder: string | null;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
  existingFolders,
  currentFolder,
}) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFolderName('');
      setError('');
      setIsCreating(false);
    }
  }, [isOpen]);

  const validateFolderName = (name: string): string | null => {
    if (!name || name.trim().length === 0) {
      return ERROR_MESSAGES.FOLDER_NAME_EMPTY;
    }

    if (name.trim().length > VALIDATION_LIMITS.FOLDER_NAME_MAX_LENGTH) {
      return ERROR_MESSAGES.FOLDER_NAME_TOO_LONG;
    }

    if (!/^[a-zA-Z0-9-_ ]+$/.test(name.trim())) {
      return ERROR_MESSAGES.FOLDER_NAME_INVALID_CHARS;
    }

    const folderNameLower = name.trim().toLowerCase();
    const isDuplicate = existingFolders.some(folder => {
      const isInCurrentFolder = (folder.parentId ?? null) === (currentFolder ?? null);
      return isInCurrentFolder && folder.name.toLowerCase() === folderNameLower;
    });

    if (isDuplicate) {
      return ERROR_MESSAGES.FOLDER_DUPLICATE(name.trim());
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateFolderName(folderName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      await onCreateFolder(folderName.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.FOLDER_CREATE_FAILED);
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={TITLES.CREATE_NEW_FOLDER} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="folder-name" className="text-sm font-medium text-neutral-700">
            {LABELS.FOLDER_NAME}
          </label>
          <input
            id="folder-name"
            type="text"
            value={folderName}
            onChange={handleInputChange}
            placeholder={PLACEHOLDERS.ENTER_FOLDER_NAME}
            autoFocus
            disabled={isCreating}
            className={`w-full px-3 py-2.5 text-base border rounded-lg font-inherit transition-all duration-200 outline-none focus:ring-2 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 placeholder:text-neutral-400 ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-100'
            }`}
          />
          {error && (
            <p className="m-0 text-sm text-red-500 animate-[shake_0.3s_ease-in-out]">{error}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="min-w-[100px] inline-flex items-center justify-center gap-2 px-4 py-2 text-base font-medium bg-neutral-200 text-neutral-700 rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-200 whitespace-nowrap"
          >
            {LABELS.CANCEL}
          </button>
          <button
            type="submit"
            disabled={isCreating || !folderName.trim()}
            className="min-w-[100px] inline-flex items-center justify-center gap-2 px-4 py-2 text-base font-medium bg-primary-600 text-white rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-primary-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600 whitespace-nowrap"
          >
            {isCreating ? LABELS.CREATING : LABELS.CREATE_FOLDER}
          </button>
        </div>
      </form>
    </Modal>
  );
};

