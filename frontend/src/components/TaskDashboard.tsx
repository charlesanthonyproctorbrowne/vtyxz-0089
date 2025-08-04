import { useState } from 'react';
import { TaskStatus } from '../types';
import { useTaskStore } from '../store';
import { useTaskActions, useSortedTasks } from '../hooks';

export function TaskDashboard() {
  const { state } = useTaskStore();
  const { setSorting, viewTask, startEditingTask, deleteTask, createTask } = useTaskActions();
  const sortedTasks = useSortedTasks(state.tasks, state.sortBy, state.sortOrder);

  // Task creation form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [isCreating, setIsCreating] = useState(false);

  // Filter and sort state
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortByLocal] = useState<string>('dueDate');
  const [sortOrder, setSortOrderLocal] = useState<'asc' | 'desc'>('asc');

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      await createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        dueDate: newTaskDueDate || undefined,
        status: newTaskStatus
      });
      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setNewTaskStatus(TaskStatus.PENDING);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortByLocal(field);
    setSortOrderLocal(newOrder);
    setSorting(field, newOrder);
  };

  const getFilteredTasks = () => {
    let filtered = sortedTasks;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }
    return filtered;
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'bg-gray-100 text-gray-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-green-100 text-green-800';
      case TaskStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRecentActivity = () => {
    return sortedTasks
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(task => ({
        action: task.status === TaskStatus.COMPLETED ? 'completed' : 'updated',
        task: task.title,
        time: new Date(task.updatedAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        user: 'You'
      }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Panel - Task Creation/Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
              <div className="flex items-center mt-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
              </div>
            </div>

            {/* Task Creation Form */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">Create New Task</span>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isCreating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isCreating}
                    >
                      <option value={TaskStatus.PENDING}>Pending</option>
                      <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TaskStatus.COMPLETED}>Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Enter task description..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isCreating}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newTaskTitle.trim() || isCreating}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isCreating ? 'Creating...' : 'Create Task'}
                </button>
              </form>
            </div>


          </div>

          {/* Right Panel - Project Roles & Team Goals */}
          <div className="space-y-6">
            {/* Change History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Change History</h2>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {getRecentActivity().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No activity yet</p>
                    <p className="text-sm">Task changes will appear here</p>
                  </div>
                ) : (
                  getRecentActivity().slice(0, 3).map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {activity.user.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{activity.user}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">{activity.time}</span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          <span className="capitalize font-medium">{activity.action}</span> task:
                          <span className="font-medium text-gray-900"> "{activity.task}"</span>
                        </p>
                        {activity.action === 'completed' && (
                          <div className="flex items-center mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-xs text-green-600 font-medium">Task completed</span>
                          </div>
                        )}
                        {activity.action === 'updated' && (
                          <div className="flex items-center mt-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-xs text-blue-600 font-medium">Task modified</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {getRecentActivity().length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {Math.min(getRecentActivity().length, 3)} recent changes</span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      View all history
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Task List with Filtering */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">All Tasks</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1"
                  >
                    <option value="all">All Status</option>
                    <option value={TaskStatus.PENDING}>Pending</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.COMPLETED}>Completed</option>
                  </select>
                  <button
                    onClick={() => handleSort('dueDate')}
                    className={`text-sm px-3 py-1 rounded ${
                      sortBy === 'dueDate' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Sort by Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {getFilteredTasks().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks found</p>
                  </div>
                ) : (
                  getFilteredTasks().map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => viewTask(task)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-500">{formatDate(task.dueDate)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingTask(task);
                            }}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id);
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
