import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskRequest, UpdateTaskRequest } from '../types/shared';
import { TaskValidator } from '../types/validation';

export class TaskController {
  private taskService = new TaskService();

  getAllTasks = async (req: Request, res: Response) => {
    try {
      const { sortBy, sortOrder } = req.query;
      const tasks = await this.taskService.getAllTasks(
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
    }
  };

  createTask = async (req: Request, res: Response) => {
    try {
      const taskData: CreateTaskRequest = req.body;

      // Comprehensive validation
      const validation = TaskValidator.validateCreateTask(taskData);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors
        });
      }

      const task = await this.taskService.createTask(taskData);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ success: false, error: 'Failed to create task' });
    }
  };

  updateTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: UpdateTaskRequest = req.body;

      // Validate ID
      const idValidation = TaskValidator.validateId(id);
      if (idValidation.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ID',
          validationErrors: idValidation
        });
      }

      // Validate update data
      const validation = TaskValidator.validateUpdateTask(updateData);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors
        });
      }

      const task = await this.taskService.updateTask(id, updateData);
      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      res.json({ success: true, data: task });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ success: false, error: 'Failed to update task' });
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Validate ID
      const idValidation = TaskValidator.validateId(id);
      if (idValidation.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ID',
          validationErrors: idValidation
        });
      }

      const success = await this.taskService.deleteTask(id);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ success: false, error: 'Failed to delete task' });
    }
  };
}
