import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/shared';
import { v4 as uuidv4 } from 'uuid';
import { TaskRepository } from '../database/taskRepository';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getAllTasks(sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): Promise<Task[]> {
    return await this.taskRepository.findAll(sortBy, sortOrder);
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const now = new Date().toISOString();
    const taskWithMetadata = {
      id: uuidv4(),
      ...taskData,
      createdAt: now,
      updatedAt: now
    };

    return await this.taskRepository.create(taskWithMetadata);
  }

  async updateTask(id: string, updateData: UpdateTaskRequest): Promise<Task | null> {
    const updateWithTimestamp = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return await this.taskRepository.update(id, updateWithTimestamp);
  }

  async deleteTask(id: string): Promise<boolean> {
    return await this.taskRepository.delete(id);
  }
}
