
import React from 'react';
import { Icon } from '../Icon/Icon';
import type { Folder } from '../../types/index';

export interface FolderCardProps {
  folder: Folder;
  onClick: (folder: Folder) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, onClick }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white border border-neutral-200 rounded-xl cursor-pointer transition-all duration-200 h-full min-h-[200px] hover:shadow-lg hover:border-accent-300 hover:-translate-y-1 group" onClick={() => onClick(folder)}>
      <div className="flex items-center justify-center flex-1 w-full">
        <Icon name="folder" size={48} className="text-accent-500 w-16 h-16 transition-colors duration-200 group-hover:text-accent-600" />
      </div>
      <div className="flex flex-col items-center gap-1 w-full text-center">
        <h3 className="m-0 text-sm font-medium text-neutral-900 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">{folder.name}</h3>
        <p className="m-0 text-xs text-neutral-500">Folder</p>
      </div>
    </div>
  );
};

