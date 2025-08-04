import { CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../types';

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

export const formValidation = {
  validateCreateTask(data: CreateTaskRequest): ValidationResult {
    const errors: FormErrors = {};

    // Validate title
    if (!data.title) {
      errors.title = 'Title is required';
    } else if (data.title.trim().length === 0) {
      errors.title = 'Title cannot be empty';
    } else if (data.title.trim().length > 200) {
      errors.title = 'Title must be less than 200 characters';
    }

    // Validate description
    if (data.description && data.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    // Validate due date
    if (data.dueDate) {
      const date = new Date(data.dueDate);
      if (isNaN(date.getTime())) {
        errors.dueDate = 'Invalid date format';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
          errors.dueDate = 'Due date cannot be in the past';
        }
      }
    }

    // Validate status
    if (!data.status) {
      errors.status = 'Status is required';
    } else if (!Object.values(TaskStatus).includes(data.status)) {
      errors.status = 'Invalid status value';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validateUpdateTask(data: UpdateTaskRequest): ValidationResult {
    const errors: FormErrors = {};

    // Only validate fields that are provided
    if (data.title !== undefined) {
      if (!data.title) {
        errors.title = 'Title is required';
      } else if (data.title.trim().length === 0) {
        errors.title = 'Title cannot be empty';
      } else if (data.title.trim().length > 200) {
        errors.title = 'Title must be less than 200 characters';
      }
    }

    if (data.description !== undefined && data.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    if (data.dueDate !== undefined) {
      const date = new Date(data.dueDate);
      if (isNaN(date.getTime())) {
        errors.dueDate = 'Invalid date format';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
          errors.dueDate = 'Due date cannot be in the past';
        }
      }
    }

    if (data.status !== undefined && !Object.values(TaskStatus).includes(data.status)) {
      errors.status = 'Invalid status value';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validateField(field: string, value: any): string | null {
    switch (field) {
      case 'title':
        if (!value) return 'Title is required';
        if (value.trim().length === 0) return 'Title cannot be empty';
        if (value.trim().length > 200) return 'Title must be less than 200 characters';
        break;
      case 'description':
        if (value && value.length > 1000) return 'Description must be less than 1000 characters';
        break;
      case 'dueDate':
        if (value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) return 'Invalid date format';
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (date < today) return 'Due date cannot be in the past';
        }
        break;
      case 'status':
        if (!value) return 'Status is required';
        if (!Object.values(TaskStatus).includes(value)) return 'Invalid status value';
        break;
    }
    return null;
  }
};
