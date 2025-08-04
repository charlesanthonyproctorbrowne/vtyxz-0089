import { Task, TaskStatus } from '../types';

export interface TaskState {
  tasks: Task[];
  editingTask: Task | null;
  viewingTask: Task | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  loading: boolean;
  error: string | null;
}

export const initialTaskState: TaskState = {
  tasks: [],
  editingTask: null,
  viewingTask: null,
  sortBy: '',
  sortOrder: 'asc',
  loading: false,
  error: null,
};

export type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_EDITING_TASK'; payload: Task | null }
  | { type: 'SET_VIEWING_TASK'; payload: Task | null }
  | { type: 'SET_SORTING'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    case 'SET_EDITING_TASK':
      return { ...state, editingTask: action.payload };

    case 'SET_VIEWING_TASK':
      return { ...state, viewingTask: action.payload };

    case 'SET_SORTING':
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
