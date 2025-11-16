
import React, { useEffect } from 'react';
import { Icon } from '../Icon/Icon';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full ${sizeClasses[size]} animate-modalSlideIn ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between py-6 px-6 border-b border-neutral-200 bg-gradient-to-r from-primary-600 to-primary-700">
            <h2 className="text-xl font-semibold m-0 text-white">{title}</h2>
            <button className="bg-transparent border-none cursor-pointer p-2 text-white flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-primary-800" onClick={onClose}>
              <Icon name="close" size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

