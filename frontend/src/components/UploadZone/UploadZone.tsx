
import React, { useRef, useState } from 'react';
import { Icon } from '../Icon/Icon';
import { MESSAGES, LABELS } from '../../constants/app.constants';

export interface UploadZoneProps {
  onFilesSelected: (files: FileList) => void;
  multiple?: boolean;
  className?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  multiple = true,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-8 border-2 border-dashed rounded-xl bg-white cursor-pointer transition-all duration-200 hover:bg-primary-50 hover:border-primary-400 ${
        isDragging ? 'border-primary-500 bg-primary-50 shadow-lg' : 'border-neutral-300'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.md"
      />
      
      <div className={`p-4 rounded-full mb-4 transition-all duration-200 ${isDragging ? 'bg-primary-100' : 'bg-neutral-100'}`}>
        <Icon name="upload" size={48} className={`transition-colors duration-200 ${isDragging ? 'text-primary-600' : 'text-neutral-600'}`} />
      </div>
      
      <p className="m-0 mb-2 text-base text-neutral-900">
        {MESSAGES.DROP_FILES_HERE} <span className="underline font-semibold text-primary-600">{LABELS.BROWSE}</span>
      </p>
      
      <p className="m-0 text-sm text-neutral-500">
        {MESSAGES.SUPPORTS_FILES}
      </p>
    </div>
  );
};

