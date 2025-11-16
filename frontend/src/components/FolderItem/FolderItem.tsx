
import React from 'react';
import { Icon } from '../Icon/Icon';

export interface FolderItemProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
  isSpecial?: boolean;
  className?: string;
}

export const FolderItem: React.FC<FolderItemProps> = ({
  name,
  isActive,
  onClick,
  isSpecial = false,
  className = '',
}) => {
  const baseClasses = 'flex items-center gap-3 w-full py-3 px-6 border-none bg-transparent text-left cursor-pointer transition-all duration-200 font-inherit text-sm font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700';
  const activeClasses = isActive ? 'bg-primary-100 text-primary-700 font-semibold' : '';
  const iconClasses = isActive ? 'text-primary-600' : 'text-neutral-500';

  const iconName = isSpecial ? 'home' : 'folder';

  return (
    <button className={`${baseClasses} ${activeClasses} ${className}`} onClick={onClick}>
      <Icon name={iconName} size={20} className={iconClasses} />
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
    </button>
  );
};

