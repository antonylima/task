export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  position: number;
  is_urgent: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewTask {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  is_urgent?: boolean;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  position?: number;
  is_urgent?: boolean;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
}

export type TaskSortOrder = 'priority' | 'created_at' | 'updated_at' | 'title';
export type SortDirection = 'asc' | 'desc';