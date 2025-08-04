import axios, { AxiosError } from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Configure axios to handle errors properly
axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Re-throw the error with the response data intact
    throw error;
  }
);

export const taskApi = {
  async getAllTasks(sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<ApiResponse<Task[]>> {
    try {
      const params = new URLSearchParams();
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await axios.get(`${API_BASE_URL}/tasks?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },

  async createTask(taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }
};
