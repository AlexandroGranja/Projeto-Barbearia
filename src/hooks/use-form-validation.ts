import { useState, useCallback } from 'react';
import { validateQueueForm, sanitizeQueueFormData, QueueFormData } from '@/lib/validation';

interface UseFormValidationOptions {
  validateOnChange?: boolean;
  sanitizeOnChange?: boolean;
}

export const useFormValidation = (options: UseFormValidationOptions = {}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  const validateForm = useCallback((data: QueueFormData) => {
    const sanitizedData = options.sanitizeOnChange 
      ? sanitizeQueueFormData(data) 
      : data;
    
    const validation = validateQueueForm(sanitizedData);
    
    setErrors(validation.errors);
    setIsValid(validation.isValid);
    
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      sanitizedData
    };
  }, [options.sanitizeOnChange]);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setIsValid(false);
  }, []);

  const addError = useCallback((error: string) => {
    setErrors(prev => [...prev, error]);
    setIsValid(false);
  }, []);

  return {
    errors,
    isValid,
    validateForm,
    clearErrors,
    addError
  };
};