export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: ValidationError[];
}
