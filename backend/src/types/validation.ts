import { TaskStatus, CreateTaskRequest, UpdateTaskRequest } from './shared';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class TaskValidator {
  static validateTitle(title: string | undefined): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!title) {
      errors.push({ field: 'title', message: 'Title is required' });
    } else if (title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (title.trim().length > 200) {
      errors.push({ field: 'title', message: 'Title must be less than 200 characters' });
    }

    return errors;
  }

  static validateDescription(description: string | undefined): ValidationError[] {
    const errors: ValidationError[] = [];

    if (description && description.length > 1000) {
      errors.push({ field: 'description', message: 'Description must be less than 1000 characters' });
    }

    return errors;
  }

  static validateDueDate(dueDate: string | undefined): ValidationError[] {
    const errors: ValidationError[] = [];

    if (dueDate) {
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        errors.push({ field: 'dueDate', message: 'Invalid date format' });
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
          errors.push({ field: 'dueDate', message: 'Due date cannot be in the past' });
        }
      }
    }

    return errors;
  }

  static validateStatus(status: string | undefined): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!status) {
      errors.push({ field: 'status', message: 'Status is required' });
    } else if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      errors.push({ field: 'status', message: 'Invalid status value' });
    }

    return errors;
  }

  static validateCreateTask(data: CreateTaskRequest): ValidationResult {
    const errors: ValidationError[] = [
      ...this.validateTitle(data.title),
      ...this.validateDescription(data.description),
      ...this.validateDueDate(data.dueDate),
      ...this.validateStatus(data.status)
    ];

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateTask(data: UpdateTaskRequest): ValidationResult {
    const errors: ValidationError[] = [];

    if (data.title !== undefined) {
      errors.push(...this.validateTitle(data.title));
    }
    if (data.description !== undefined) {
      errors.push(...this.validateDescription(data.description));
    }
    if (data.dueDate !== undefined) {
      errors.push(...this.validateDueDate(data.dueDate));
    }
    if (data.status !== undefined) {
      errors.push(...this.validateStatus(data.status));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateId(id: string | undefined): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!id) {
      errors.push({ field: 'id', message: 'ID is required' });
    } else if (id.trim().length === 0) {
      errors.push({ field: 'id', message: 'ID cannot be empty' });
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      errors.push({ field: 'id', message: 'Invalid ID format' });
    }

    return errors;
  }
}
