import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface ValidationOptions {
  validateOnChange?: boolean;
  sanitizeOnChange?: boolean;
}

export const useFormValidation = <T extends ZodSchema<any>>(schema?: T, options: ValidationOptions = {}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  const validateForm = useCallback((data: any) => {
    if (!schema) {
      setErrors({});
      setIsValid(true);
      return { isValid: true, sanitizedData: data };
    }
    try {
      const sanitizedData = schema.parse(data);
      setErrors({});
      setIsValid(true);
      return { isValid: true, sanitizedData };
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          if (issue.path.length > 0) {
            newErrors[issue.path[0]] = issue.message;
          }
        }
        setErrors(newErrors);
        setIsValid(false);
        return { isValid: false, sanitizedData: data };
      }
      setErrors({ general: 'An unexpected validation error occurred.' });
      setIsValid(false);
      return { isValid: false, sanitizedData: data };
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  const addError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
    setIsValid(false);
  }, []);

  return {
    errors,
    isValid,
    validateForm,
    clearErrors,
    addError,
  };
};
