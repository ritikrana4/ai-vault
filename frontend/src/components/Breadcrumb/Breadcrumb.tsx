
import React, { useMemo } from 'react';
import type { Folder } from '../../types/index';
import { FOLDER_NAMES } from '../../constants/app.constants';

export interface BreadcrumbProps {
  selectedFolder: string | null;
  folders: Folder[];
  onNavigate: (id: string | null) => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  selectedFolder, 
  folders, 
  onNavigate, 
  className = '' 
}) => {
  const items = useMemo(() => {
    const breadcrumbItems: { name: string; id: string | null }[] = [
      { name: FOLDER_NAMES.ALL_FILES, id: null }
    ];

    if (!selectedFolder) {
      return breadcrumbItems;
    }

    const folderMap = new Map(folders.map(f => [f.id, f]));
    let current = folderMap.get(selectedFolder) || null;
    const stack: { name: string; id: string }[] = [];

    while (current) {
      stack.push({ name: current.name, id: current.id });
      current = current.parentId ? folderMap.get(current.parentId) || null : null;
    }

    stack.reverse().forEach(item => breadcrumbItems.push(item));
    return breadcrumbItems;
  }, [selectedFolder, folders]);

  if (items.length === 0) return null;

  return (
    <nav className={`flex items-center gap-2 text-sm text-neutral-500 flex-wrap ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={item.id ?? 'root'}>
          {index > 0 && <span className="text-neutral-300 select-none">/</span>}
          <button
            className={`py-1 px-2 border-none bg-transparent text-neutral-600 cursor-pointer rounded-lg transition-all duration-200 text-sm font-inherit hover:bg-primary-50 hover:text-primary-700 ${
              index === items.length - 1 ? 'text-neutral-900 font-semibold cursor-default hover:bg-transparent' : ''
            }`}
            onClick={() => onNavigate(item.id)}
            aria-current={index === items.length - 1 ? 'page' : undefined}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

