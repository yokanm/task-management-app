import axios, { AxiosError, AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL
const LOCAL_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://192.168.1.108:4000';
const API_BASE_URL = __DEV__ ? `${LOCAL_HOST}/api/v1` : 'https://your-production-api.com/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear storage and redirect to login
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    apiClient.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),

  logout: () => apiClient.post('/auth/logout'),
};

export const tasksAPI = {
  getTasks: () => apiClient.get('/tasks'),
  getTask: (id: string) => apiClient.get(`/tasks/${id}`),
  createTask: (data: any) => apiClient.post('/tasks', data),
  updateTask: (id: string, data: any) => apiClient.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => apiClient.delete(`/tasks/${id}`),
  getTodayTasks: () => apiClient.get('/tasks/today'),
  getTaskStats: () => apiClient.get('/tasks/stats'),
};

export const projectsAPI = {
  getProjects: () => apiClient.get('/project'),
  getProject: (id: string) => apiClient.get(`/project/${id}`),
  createProject: (data: any) => apiClient.post('/project', data),
  updateProject: (id: string, data: any) => apiClient.put(`/project/${id}`, data),
  deleteProject: (id: string) => apiClient.delete(`/project/${id}`),
};

export const taskGroupsAPI = {
  getTaskGroups: () => apiClient.get('/taskgroups'),
  getTaskGroup: (id: string) => apiClient.get(`/taskgroups/${id}`),
  createTaskGroup: (data: any) => apiClient.post('/taskgroups', data),
  updateTaskGroup: (id: string, data: any) => apiClient.put(`/taskgroups/${id}`, data),
  deleteTaskGroup: (id: string) => apiClient.delete(`/taskgroups/${id}`),
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.put('/users/profile', data),
  changePassword: (data: any) => apiClient.put('/users/change-password', data),
  getPreferences: () => apiClient.get('/users/preferences'),
  updatePreferences: (data: any) => apiClient.put('/users/preferences', data),
};

export default apiClient;