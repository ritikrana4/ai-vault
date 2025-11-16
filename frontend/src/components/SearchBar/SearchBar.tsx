
import React from 'react';
import { Icon } from '../Icon/Icon';
import { PLACEHOLDERS } from '../../constants/app.constants';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = PLACEHOLDERS.SEARCH_DOCUMENTS,
  className = '',
}) => {
  return (
    <div className={`relative flex items-center w-full max-w-2xl ${className}`}>
      <Icon name="search" size={20} className="absolute left-4 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2.5 pl-11 pr-4 border border-neutral-300 rounded-lg text-sm outline-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
      />
    </div>
  );
};

