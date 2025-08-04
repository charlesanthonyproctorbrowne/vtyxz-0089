import { useState } from 'react';
import { TaskStatus } from '../types';
import { useTaskStore } from '../store';
import { useTaskActions } from '../hooks';
import { ConfirmDialog } from './ConfirmDialog';



export function TaskDetail() {
  const { state } = useTaskStore();
  const { updateTask, deleteTask, startEditingTask, closeTaskView } = useTaskActions();
  const task = state.viewingTask;

  if (!task) return null;

  const [isCompleted, setIsCompleted] = useState(task.status === TaskStatus.COMPLETED);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'bg-gray-100 text-gray-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-green-100 text-green-800';
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkComplete = async () => {
    const newStatus = isCompleted ? TaskStatus.IN_PROGRESS : TaskStatus.COMPLETED;
    await updateTask(task.id, { status: newStatus });
    setIsCompleted(!isCompleted);
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(task.id);
      closeTaskView();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Task Details */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">{task.title} — Task Management</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkComplete}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                Mark Complete
              </button>
              <button
                onClick={closeTaskView}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Task Category */}
          <div className="mb-2">
            <span className="text-sm text-gray-500">Task Management</span>
          </div>

          {/* Task Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Task—{task.title}</h2>

          {/* Task Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {task.description || 'No description provided for this task.'}
              </p>
            </div>
          </div>

          {/* Task Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium text-gray-900">Task Created</div>
                  <div className="text-sm text-gray-500">{formatDate(task.createdAt)}</div>
                </div>
              </div>

              {task.updatedAt !== task.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Last Updated</div>
                    <div className="text-sm text-gray-500">{formatDate(task.updatedAt)}</div>
                  </div>
                </div>
              )}

              {task.status === TaskStatus.COMPLETED && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-gray-900">Task Completed</div>
                    <div className="text-sm text-gray-500">Status changed to completed</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Task Information */}
        <div className="w-80 bg-gray-50 p-6 overflow-y-auto">
          {/* Task Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Due Date</label>
                <div className="mt-1 text-sm text-gray-900">
                  {formatDate(task.dueDate)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <div className="mt-1 text-sm text-gray-900">
                  {formatDate(task.createdAt)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <div className="mt-1 text-sm text-gray-900">
                  {formatDate(task.updatedAt)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <div className="mt-1">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                    Normal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <button
                onClick={() => {
                  startEditingTask(task);
                  closeTaskView();
                }}
                className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Edit Task</span>
              </button>

              <button
                onClick={handleMarkComplete}
                className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                </span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-sm font-medium">Delete Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
        onConfirm={handleDeleteTask}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive={true}
      />
    </div>
  );
};
