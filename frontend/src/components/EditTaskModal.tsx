import { useState, useEffect } from 'react';
import { TaskStatus } from '../types';
import { useFormState } from './useFormState';
import { useTaskStore } from '../store';
import { useTaskActions } from '../hooks';

interface EditTaskModalProps {
  onClose: () => void;
}

export function EditTaskModal({ onClose }: EditTaskModalProps) {
  const { state } = useTaskStore();
  const { updateTask, cancelEditingTask } = useTaskActions();
  const task = state.editingTask;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    errors,
    validateUpdateTask,
    clearErrors,
    clearFieldError,
    setErrors
  } = useFormState();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      setStatus(task.status);
    }
    clearErrors();
    setSubmitError('');
  }, [task, clearErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    setSubmitError('');

    const formData = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      status
    };

    const isValid = validateUpdateTask(formData);
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      await updateTask(task.id, formData);
      onClose();
    } catch (error: any) {
      if (error.response?.data?.validationErrors) {
        const serverErrors: { [key: string]: string } = {};
        error.response.data.validationErrors.forEach((err: any) => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      } else {
        setSubmitError(error.response?.data?.error || 'An error occurred while updating the task');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    if (errors[field]) {
      clearFieldError(field);
    }
    setSubmitError('');

    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'dueDate':
        setDueDate(value);
        break;
      case 'status':
        setStatus(value as TaskStatus);
        break;
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      cancelEditingTask();
      onClose();
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Task</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {submitError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {submitError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter task title"
                maxLength={200}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Enter task description"
                maxLength={1000}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/1000 characters
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  {Object.values(TaskStatus).map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
