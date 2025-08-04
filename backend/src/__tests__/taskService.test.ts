import { TaskService } from '../services/taskService';
import { TaskStatus } from '../types/shared';
import DatabaseConnection from '../database/connection';

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    // Set test environment to use in-memory database
    process.env.NODE_ENV = 'test';
    taskService = new TaskService();
  });

  afterAll(() => {
    // Clean up database connection
    DatabaseConnection.getInstance().close();
  });

  describe('createTask', () => {
    it('should create a task with all required fields', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING
      };

      const task = await taskService.createTask(taskData);

      expect(task.id).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.status).toBe(taskData.status);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });
  });

  describe('getAllTasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const tasks = await taskService.getAllTasks();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks', async () => {
      await taskService.createTask({ title: 'Task 1', status: TaskStatus.PENDING });
      await taskService.createTask({ title: 'Task 2', status: TaskStatus.COMPLETED });

      const tasks = await taskService.getAllTasks();
      expect(tasks).toHaveLength(2);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const task = await taskService.createTask({ title: 'Original', status: TaskStatus.PENDING });

      const updatedTask = await taskService.updateTask(task.id, {
        title: 'Updated',
        status: TaskStatus.COMPLETED
      });

      expect(updatedTask?.title).toBe('Updated');
      expect(updatedTask?.status).toBe(TaskStatus.COMPLETED);
    });

    it('should return null for non-existent task', async () => {
      const result = await taskService.updateTask('non-existent', { title: 'Updated' });
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      const task = await taskService.createTask({ title: 'To Delete', status: TaskStatus.PENDING });

      const result = await taskService.deleteTask(task.id);
      expect(result).toBe(true);

      const tasks = await taskService.getAllTasks();
      expect(tasks).toHaveLength(0);
    });

    it('should return false for non-existent task', async () => {
      const result = await taskService.deleteTask('non-existent');
      expect(result).toBe(false);
    });
  });
});
