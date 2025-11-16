
import React, { useMemo } from 'react';
import { FolderItem } from '../FolderItem/FolderItem';
import { FolderTreeItem } from '../FolderTreeItem/FolderTreeItem';
import { buildFolderTree } from '../../utils/folder.utils';
import type { Folder } from '../../types/index';
import { FOLDER_NAMES, LABELS } from '../../constants/app.constants';

export interface SidebarProps {
  folders: Folder[];
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  selectedFolder,
  onSelectFolder,
  className = '',
}) => {
  const folderTree = useMemo(() => buildFolderTree(folders), [folders]);

  return (
    <aside className={`flex flex-col w-64 h-screen bg-white border-r border-neutral-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between py-4 px-6 border-b border-neutral-200  from-primary-600 to-primary-700">
        <h2 className="m-0 text-lg font-semibold text-black">{LABELS.FOLDERS}</h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <FolderItem
          key="all-files"
          name={FOLDER_NAMES.ALL_FILES}
          isActive={selectedFolder === null}
          isSpecial={true}
          onClick={() => onSelectFolder(null)}
        />
        
        {folderTree.map((folder) => (
          <FolderTreeItem
            key={folder.id}
            folder={folder}
            level={0}
            isActive={selectedFolder === folder.id}
            selectedId={selectedFolder}
            onSelect={onSelectFolder}
          />
        ))}
      </nav>
    </aside>
  );
};
