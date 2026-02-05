import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL
const LOCAL_HOST = Platform.OS === 'android' ? 'http://192.168.1.108:4000' : 'http://localhost:4000';
const API_BASE_URL = __DEV__ ? `${LOCAL_HOST}/api/v1` : 'https://your-production-api.com/api/v1';

/**
 * Generic API request function using native fetch
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Get token from storage
    const token = await AsyncStorage.getItem('token');

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Parse response
    const data = await response.json();

    // Handle errors
    if (!response.ok) {
      // Handle 401 Unauthorized - clear storage and redirect to login
      if (response.status === 401) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      }
      
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// ==================== AUTH API ====================
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
};

// ==================== TASKS API ====================
export const tasksAPI = {
  getTasks: () => apiRequest('/tasks'),
  
  getTask: (id: string) => apiRequest(`/tasks/${id}`),
  
  createTask: (data: any) =>
    apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateTask: (id: string, data: any) =>
    apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteTask: (id: string) =>
    apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    }),
  
  getTodayTasks: () => apiRequest('/tasks/today'),
  
  getTaskStats: () => apiRequest('/tasks/stats'),
};

// ==================== PROJECTS API ====================
export const projectsAPI = {
  getProjects: () => apiRequest('/project'),
  
  getProject: (id: string) => apiRequest(`/project/${id}`),
  
  createProject: (data: any) =>
    apiRequest('/project', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateProject: (id: string, data: any) =>
    apiRequest(`/project/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteProject: (id: string) =>
    apiRequest(`/project/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== TASK GROUPS API ====================
export const taskGroupsAPI = {
  getTaskGroups: () => apiRequest('/taskgroups'),
  
  getTaskGroup: (id: string) => apiRequest(`/taskgroups/${id}`),
  
  createTaskGroup: (data: any) =>
    apiRequest('/taskgroups', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateTaskGroup: (id: string, data: any) =>
    apiRequest(`/taskgroups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deleteTaskGroup: (id: string) =>
    apiRequest(`/taskgroups/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== USER API ====================
export const userAPI = {
  getProfile: () => apiRequest('/users/profile'),
  
  updateProfile: (data: any) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  changePassword: (data: any) =>
    apiRequest('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  getPreferences: () => apiRequest('/users/preferences'),
  
  updatePreferences: (data: any) =>
    apiRequest('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export default apiRequest;