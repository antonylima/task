import { Task, NewTask, UpdateTask, APIResponse } from '../types';
import { Config } from '../utils/config';

class TaskService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Config.REQUEST_TIMEOUT);

      const response = await fetch(`${Config.API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { error: 'Request timeout - please try again' };
        }
        return { error: error.message };
      }
      return { error: 'Unknown error occurred' };
    }
  }

  async getAllTasks(sortBy?: string, order?: string): Promise<APIResponse<Task[]>> {
    const params = new URLSearchParams();
    if (sortBy) params.set('sort', sortBy);
    if (order) params.set('order', order);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    
    return this.request<Task[]>(endpoint);
  }

  async getTask(id: number): Promise<APIResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(task: NewTask): Promise<APIResponse<Task>> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: number, updates: UpdateTask): Promise<APIResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: number): Promise<APIResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTaskStatus(id: number, status: Task['status']): Promise<APIResponse<Task>> {
    return this.updateTask(id, { status });
  }

  async updateTaskPriority(id: number, priority: Task['priority']): Promise<APIResponse<Task>> {
    return this.updateTask(id, { priority });
  }

  async toggleUrgent(id: number): Promise<APIResponse<Task>> {
    return this.request<Task>(`/tasks/${id}/toggle-urgent`, {
      method: 'POST',
    });
  }

  async moveTaskUp(id: number): Promise<APIResponse<Task>> {
    return this.request<Task>(`/tasks/${id}/move-up`, {
      method: 'POST',
    });
  }

  async moveTaskDown(id: number): Promise<APIResponse<Task>> {
    return this.request<Task>(`/tasks/${id}/move-down`, {
      method: 'POST',
    });
  }
}

export default new TaskService();