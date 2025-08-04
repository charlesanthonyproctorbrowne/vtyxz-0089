import { taskReducer, initialTaskState, TaskAction } from '../store/taskStore';
import { TaskStatus } from '../types';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  dueDate: '2025-12-31',
  status: TaskStatus.PENDING,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
};

describe('taskReducer', () => {
  it('should return initial state', () => {
    const action = { type: 'UNKNOWN' } as any;
    const state = taskReducer(initialTaskState, action);
    expect(state).toEqual(initialTaskState);
  });

  it('should handle SET_TASKS', () => {
    const action: TaskAction = {
      type: 'SET_TASKS',
      payload: [mockTask],
    };
    const state = taskReducer(initialTaskState, action);
    expect(state.tasks).toEqual([mockTask]);
  });

  it('should handle ADD_TASK', () => {
    const action: TaskAction = {
      type: 'ADD_TASK',
      payload: mockTask,
    };
    const state = taskReducer(initialTaskState, action);
    expect(state.tasks).toEqual([mockTask]);
  });

  it('should handle UPDATE_TASK', () => {
    const initialState = {
      ...initialTaskState,
      tasks: [mockTask],
    };
    const updatedTask = { ...mockTask, title: 'Updated Task' };
    const action: TaskAction = {
      type: 'UPDATE_TASK',
      payload: updatedTask,
    };
    const state = taskReducer(initialState, action);
    expect(state.tasks[0].title).toBe('Updated Task');
  });

  it('should handle DELETE_TASK', () => {
    const initialState = {
      ...initialTaskState,
      tasks: [mockTask],
    };
    const action: TaskAction = {
      type: 'DELETE_TASK',
      payload: '1',
    };
    const state = taskReducer(initialState, action);
    expect(state.tasks).toEqual([]);
  });

  it('should handle SET_EDITING_TASK', () => {
    const action: TaskAction = {
      type: 'SET_EDITING_TASK',
      payload: mockTask,
    };
    const state = taskReducer(initialTaskState, action);
    expect(state.editingTask).toEqual(mockTask);
  });

  it('should handle SET_VIEWING_TASK', () => {
    const action: TaskAction = {
      type: 'SET_VIEWING_TASK',
      payload: mockTask,
    };
    const state = taskReducer(initialTaskState, action);
    expect(state.viewingTask).toEqual(mockTask);
  });

  it('should handle SET_SORTING', () => {
    const action: TaskAction = {
      type: 'SET_SORTING',
      payload: { sortBy: 'dueDate', sortOrder: 'desc' },
    };
    const state = taskReducer(initialTaskState, action);
    expect(state.sortBy).toBe('dueDate');
    expect(state.sortOrder).toBe('desc');
  });

  it('should handle SET_LOADING', () => {
    const action: TaskAction = {
      type: 'SET_LOADING',
      payload: true,
    };
    const state = taskReducer(initialTaskState, action);
    expect(state.loading).toBe(true);
  });

  it('should handle SET_ERROR', () => {
    const action: TaskAction = {
      type: 'SET_ERROR',
      payload: 'Test error',
    };
    const state = taskReducer(initialTaskState, action);
    expect(state.error).toBe('Test error');
  });
});
