import { createContext, useContext, useReducer, ReactNode } from 'react';
import { taskReducer, initialTaskState, TaskState, TaskAction } from './taskStore';

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskStore() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskStore must be used within a TaskProvider');
  }
  return context;
}
