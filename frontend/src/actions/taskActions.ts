import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';
import { TaskAction } from '../store';
import { taskApi } from '../api/taskApi';

export const taskActions = {
  // Sync actions (pure)
  setTasks: (tasks: Task[]): TaskAction => ({
    type: 'SET_TASKS',
    payload: tasks,
  }),

  addTask: (task: Task): TaskAction => ({
    type: 'ADD_TASK',
    payload: task,
  }),

  updateTask: (task: Task): TaskAction => ({
    type: 'UPDATE_TASK',
    payload: task,
  }),

  deleteTask: (taskId: string): TaskAction => ({
    type: 'DELETE_TASK',
    payload: taskId,
  }),

  setEditingTask: (task: Task | null): TaskAction => ({
    type: 'SET_EDITING_TASK',
    payload: task,
  }),

  setViewingTask: (task: Task | null): TaskAction => ({
    type: 'SET_VIEWING_TASK',
    payload: task,
  }),

  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc'): TaskAction => ({
    type: 'SET_SORTING',
    payload: { sortBy, sortOrder },
  }),

  setLoading: (loading: boolean): TaskAction => ({
    type: 'SET_LOADING',
    payload: loading,
  }),

  setError: (error: string | null): TaskAction => ({
    type: 'SET_ERROR',
    payload: error,
  }),

  // Async actions (thunks)
  loadTasks: (dispatch: React.Dispatch<TaskAction>) => async (sortBy?: string, sortOrder?: 'asc' | 'desc') => {
    dispatch(taskActions.setLoading(true));
    dispatch(taskActions.setError(null));

    try {
      const response = await taskApi.getAllTasks(sortBy, sortOrder);
      if (response.success && response.data) {
        dispatch(taskActions.setTasks(response.data));
      } else {
        dispatch(taskActions.setError('Failed to load tasks'));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      dispatch(taskActions.setError('Failed to load tasks'));
    } finally {
      dispatch(taskActions.setLoading(false));
    }
  },

  createTask: (dispatch: React.Dispatch<TaskAction>) => async (taskData: CreateTaskRequest) => {
    dispatch(taskActions.setError(null));

    try {
      const response = await taskApi.createTask(taskData);
      if (response.success && response.data) {
        dispatch(taskActions.addTask(response.data));
      } else {
        throw new Error(response.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  updateTaskAsync: (dispatch: React.Dispatch<TaskAction>) => async (id: string, taskData: UpdateTaskRequest) => {
    dispatch(taskActions.setError(null));

    try {
      const response = await taskApi.updateTask(id, taskData);
      if (response.success && response.data) {
        dispatch(taskActions.updateTask(response.data));
        dispatch(taskActions.setEditingTask(null));
      } else {
        throw new Error(response.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTaskAsync: (dispatch: React.Dispatch<TaskAction>) => async (id: string) => {
    dispatch(taskActions.setError(null));

    try {
      const response = await taskApi.deleteTask(id);
      if (response.success) {
        dispatch(taskActions.deleteTask(id));
      } else {
        dispatch(taskActions.setError('Failed to delete task'));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      dispatch(taskActions.setError('Failed to delete task'));
    }
  },
};
