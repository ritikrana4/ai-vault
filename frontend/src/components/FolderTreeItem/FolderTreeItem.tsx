
import React, { useState } from 'react';
import { Icon } from '../Icon/Icon';
import type { Folder } from '../../types/index';

export interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
}

export interface FolderTreeItemProps {
  folder: FolderTreeNode;
  level: number;
  isActive: boolean;
  selectedId: string | null;
  onSelect: (folderId: string | null) => void;
}

export const FolderTreeItem: React.FC<FolderTreeItemProps> = ({
  folder,
  level,
  isActive,
  selectedId,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    onSelect(folder.id);
  };

  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors duration-200 rounded-lg my-0.5 mx-2 select-none hover:bg-primary-50 hover:text-primary-700 ${isActive ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-neutral-700'}`}
        style={{ paddingLeft: `${level * 1.25 + 0.75}rem` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <button
            className="flex items-center justify-center w-4 h-4 p-0 border-none bg-transparent cursor-pointer text-neutral-600 flex-shrink-0 hover:text-primary-600"
            onClick={handleToggle}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={16} />
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}
        
        <Icon name="folder" size={18} className={`flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-neutral-500'}`} />
        
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm">{folder.name}</span>
      </div>

      {hasChildren && isExpanded && (
        <div className="w-full">
          {folder.children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              level={level + 1}
              isActive={selectedId === child.id}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
