
import React from 'react';
import {
  FiFolder,
  FiFile,
  FiUpload,
  FiSearch,
  FiX,
  FiChevronRight,
  FiChevronDown,
  FiPlus,
  FiHome,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { ERROR_MESSAGES } from '../../constants/app.constants';

export type IconName =
  | 'folder'
  | 'file'
  | 'upload'
  | 'search'
  | 'close'
  | 'chevron-right'
  | 'chevron-down'
  | 'plus'
  | 'home';

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: Record<IconName, IconType> = {
  folder: FiFolder,
  file: FiFile,
  upload: FiUpload,
  search: FiSearch,
  close: FiX,
  'chevron-right': FiChevronRight,
  'chevron-down': FiChevronDown,
  plus: FiPlus,
  home: FiHome,
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = '', style }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(ERROR_MESSAGES.ICON_NOT_FOUND(name));
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={`inline-block align-middle leading-none flex-shrink-0 ${className}`}
      style={style}
    />
  );
};
