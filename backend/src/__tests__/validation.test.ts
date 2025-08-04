import { TaskValidator } from '../types/validation';
import { TaskStatus } from '../types/shared';

describe('TaskValidator', () => {
  describe('validateTitle', () => {
    it('should return error for empty title', () => {
      const errors = TaskValidator.validateTitle('');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Title is required');
    });

    it('should return error for undefined title', () => {
      const errors = TaskValidator.validateTitle(undefined);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Title is required');
    });

    it('should return error for title too long', () => {
      const longTitle = 'a'.repeat(201);
      const errors = TaskValidator.validateTitle(longTitle);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Title must be less than 200 characters');
    });

    it('should return no errors for valid title', () => {
      const errors = TaskValidator.validateTitle('Valid title');
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateDescription', () => {
    it('should return error for description too long', () => {
      const longDescription = 'a'.repeat(1001);
      const errors = TaskValidator.validateDescription(longDescription);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Description must be less than 1000 characters');
    });

    it('should return no errors for valid description', () => {
      const errors = TaskValidator.validateDescription('Valid description');
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for undefined description', () => {
      const errors = TaskValidator.validateDescription(undefined);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateDueDate', () => {
    it('should return error for invalid date format', () => {
      const errors = TaskValidator.validateDueDate('invalid-date');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Invalid date format');
    });

    it('should return error for past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const errors = TaskValidator.validateDueDate(yesterday.toISOString().split('T')[0]);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Due date cannot be in the past');
    });

    it('should return no errors for future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const errors = TaskValidator.validateDueDate(tomorrow.toISOString().split('T')[0]);
      expect(errors).toHaveLength(0);
    });

    it('should return no errors for undefined date', () => {
      const errors = TaskValidator.validateDueDate(undefined);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateStatus', () => {
    it('should return error for invalid status', () => {
      const errors = TaskValidator.validateStatus('INVALID_STATUS');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Invalid status value');
    });

    it('should return error for undefined status', () => {
      const errors = TaskValidator.validateStatus(undefined);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Status is required');
    });

    it('should return no errors for valid status', () => {
      const errors = TaskValidator.validateStatus(TaskStatus.PENDING);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateCreateTask', () => {
    it('should validate complete task creation', () => {
      const validTask = {
        title: 'Valid Task',
        description: 'Valid description',
        dueDate: '2025-12-31',
        status: TaskStatus.PENDING
      };

      const result = TaskValidator.validateCreateTask(validTask);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid task creation', () => {
      const invalidTask = {
        title: '',
        description: 'a'.repeat(1001),
        dueDate: 'invalid-date',
        status: 'INVALID_STATUS' as any
      };

      const result = TaskValidator.validateCreateTask(invalidTask);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
