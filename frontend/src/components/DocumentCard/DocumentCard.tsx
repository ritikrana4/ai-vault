
import React from 'react';
import type { Document } from '../../types';
import { Icon } from '../Icon/Icon';
import { formatFileSize, formatDate } from '../../utils';

export interface DocumentCardProps {
  document: Document;
  onClick: () => void;
  className?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onClick,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-neutral-200 rounded-xl p-6 cursor-pointer transition-all duration-200 flex flex-col hover:shadow-lg hover:border-primary-300 hover:-translate-y-1 group ${className}`} onClick={onClick}>
      <div className="text-primary-600 mb-4 transition-colors duration-200 group-hover:text-primary-700">
        <Icon name="file" size={48} />
      </div>
      
      <h3 className="m-0 mb-2 text-base font-semibold text-neutral-900 overflow-hidden text-ellipsis whitespace-nowrap" title={document.originalName}>
        {document.originalName}
      </h3>
      
      <p className="m-0 text-sm text-neutral-500">
        {formatFileSize(document.size)} • {formatDate(document.uploadDate)}
      </p>
    </div>
  );
};

