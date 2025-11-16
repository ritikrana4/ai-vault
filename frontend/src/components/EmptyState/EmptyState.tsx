
import React from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'file',
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}>
      <div className="p-6 rounded-full bg-neutral-100 mb-6">
        <Icon name={icon} size={64} className="text-neutral-400" />
      </div>
      <h3 className="m-0 mb-2 text-xl font-semibold text-neutral-900">{title}</h3>
      {description && <p className="m-0 mb-6 text-sm text-neutral-500 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

