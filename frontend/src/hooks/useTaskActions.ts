import { useCallback } from 'react';
import { CreateTaskRequest, UpdateTaskRequest, Task } from '../types';
import { useTaskStore } from '../store';
import { taskActions } from '../actions';

export function useTaskActions() {
  const { dispatch } = useTaskStore();

  const loadTasks = useCallback(async (sortBy?: string, sortOrder?: 'asc' | 'desc') => {
    await taskActions.loadTasks(dispatch)(sortBy, sortOrder);
  }, [dispatch]);

  const createTask = useCallback(async (taskData: CreateTaskRequest) => {
    await taskActions.createTask(dispatch)(taskData);
  }, [dispatch]);

  const updateTask = useCallback(async (id: string, taskData: UpdateTaskRequest) => {
    await taskActions.updateTaskAsync(dispatch)(id, taskData);
  }, [dispatch]);

  const deleteTask = useCallback(async (id: string) => {
    await taskActions.deleteTaskAsync(dispatch)(id);
  }, [dispatch]);

  const startEditingTask = useCallback((task: Task) => {
    dispatch(taskActions.setEditingTask(task));
  }, [dispatch]);

  const cancelEditingTask = useCallback(() => {
    dispatch(taskActions.setEditingTask(null));
  }, [dispatch]);

  const viewTask = useCallback((task: Task) => {
    dispatch(taskActions.setViewingTask(task));
  }, [dispatch]);

  const closeTaskView = useCallback(() => {
    dispatch(taskActions.setViewingTask(null));
  }, [dispatch]);

  const setSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    dispatch(taskActions.setSorting(sortBy, sortOrder));
  }, [dispatch]);

  return {
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    startEditingTask,
    cancelEditingTask,
    viewTask,
    closeTaskView,
    setSorting,
  };
}
