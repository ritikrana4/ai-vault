
import React from 'react';
import { Icon } from '../Icon/Icon';
import { Spinner } from '../Spinner/Spinner';
import type { UploadProgress as UploadProgressType } from '../../types/index';
import { MESSAGES, STATUS_LABELS } from '../../constants/app.constants';

export interface UploadProgressProps {
  uploads: UploadProgressType[];
  onClose: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ uploads, onClose }) => {
  if (uploads.length === 0) return null;

  const completedCount = uploads.filter(u => u.status === 'completed').length;
  const errorCount = uploads.filter(u => u.status === 'error').length;
  const uploadingCount = uploads.filter(u => u.status === 'uploading' || u.status === 'processing').length;
  
  const allUploadsDone = uploadingCount === 0;

  const renderStatusIcon = (status: string) => {
    if (status === 'uploading' || status === 'processing') {
      return <Spinner size="sm" />;
    }
    if (status === 'completed') {
      return <Icon name="file" size={16} className="text-primary-600" />;
    }
    if (status === 'error') {
      return <Icon name="close" size={16} className="text-red-600" />;
    }
    return <Icon name="file" size={16} className="text-neutral-600" />;
  };

  const renderStatusLabel = (upload: UploadProgressType) => {
    switch (upload.status) {
      case 'uploading':
        return STATUS_LABELS.UPLOADING;
      case 'processing':
        return STATUS_LABELS.PROCESSING;
      case 'completed':
        return STATUS_LABELS.COMPLETED;
      case 'error':
        return upload.error || STATUS_LABELS.FAILED;
      default:
        return '';
    }
  };

  return (
    <div className="fixed bottom-8 right-8 w-[360px] max-h-[480px] bg-white border border-neutral-200 rounded-xl shadow-2xl z-[1000] flex flex-col overflow-hidden animate-slideInUp">
      <div className="flex items-center justify-between py-4 px-5 border-b border-neutral-200 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="flex items-center gap-3 text-sm font-semibold text-white">
          <Icon name="upload" size={18} className="text-white" />
          <span>
            {uploadingCount > 0 
              ? `${MESSAGES.UPLOADING} ${uploadingCount} file${uploadingCount > 1 ? 's' : ''}...` 
              : `${completedCount} file${completedCount > 1 ? 's' : ''} ${MESSAGES.UPLOADED}`}
          </span>
        </div>
        {allUploadsDone && (
          <button 
            className="flex items-center justify-center w-7 h-7 p-0 border-none bg-transparent cursor-pointer text-white rounded-lg transition-all duration-200 hover:bg-primary-800"
            onClick={onClose}
            aria-label={MESSAGES.CLOSE_UPLOAD_PROGRESS}
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2 max-h-[360px]">
        {uploads.map((upload, index) => (
          <div key={index} className="flex items-start gap-3 py-3 px-5 transition-colors duration-200 hover:bg-neutral-50">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
              upload.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'
            }`}>
              {renderStatusIcon(upload.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-neutral-900 overflow-hidden text-ellipsis whitespace-nowrap mb-1" title={upload.fileName}>
                {upload.fileName}
              </div>
              <div className={`text-xs ${upload.status === 'error' ? 'text-red-600' : 'text-neutral-600'}`}>
                {renderStatusLabel(upload)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {errorCount > 0 && (
        <div className="py-3 px-5 border-t border-neutral-200 bg-red-50">
          <span className="text-xs font-medium text-red-700">
            {errorCount} file{errorCount > 1 ? 's' : ''} {MESSAGES.FILES_FAILED_TO_UPLOAD}
          </span>
        </div>
      )}
    </div>
  );
};

