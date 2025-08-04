import { useState, useCallback } from 'react';
import { formValidation, FormErrors } from '../utils';
import { CreateTaskRequest, UpdateTaskRequest } from '../types';

export const useFormState = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateCreateTask = useCallback((data: CreateTaskRequest): boolean => {
    const result = formValidation.validateCreateTask(data);
    setErrors(result.errors);
    return result.isValid;
  }, []);

  const validateUpdateTask = useCallback((data: UpdateTaskRequest): boolean => {
    const result = formValidation.validateUpdateTask(data);
    setErrors(result.errors);
    return result.isValid;
  }, []);

  const validateField = useCallback((field: string, value: any): string | null => {
    const error = formValidation.validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
    return error;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }, []);

  return {
    errors,
    validateCreateTask,
    validateUpdateTask,
    validateField,
    clearErrors,
    clearFieldError,
    setErrors
  };
};
