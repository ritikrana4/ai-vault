
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../constants/api.constants';
import { ERROR_MESSAGES } from '../constants/app.constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFileType = (file: File): ValidationResult => {
  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: ERROR_MESSAGES.FILE_TYPE_NOT_SUPPORTED(file.type),
    };
  }
  return { valid: true };
};

export const validateFileSize = (file: File): ValidationResult => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: ERROR_MESSAGES.FILE_SIZE_EXCEEDS(MAX_FILE_SIZE / 1024 / 1024),
    };
  }
  return { valid: true };
};

export const validateFile = (file: File): ValidationResult => {
  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) return typeValidation;
  
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) return sizeValidation;
  
  return { valid: true };
};

