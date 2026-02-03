import axios, { AxiosError, AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';

// API Base URL - Update this to your backend URL. Note: Android emulators use 10.0.2.2 to reach host machine.
const LOCAL_HOST =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
const API_BASE_URL = __DEV__
  ? `${LOCAL_HOST}/api/v1`
  : 'https://your-production-api.com/api/v1';

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
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (refreshToken) {
        try {
          // Call refresh token endpoint
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;

          // Update tokens (use new refresh token if provided)
          setTokens(newAccessToken, newRefreshToken ?? refreshToken);

          // Retry original request with new access token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          logout();
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout
        logout();
      }
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

  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh-token', { refreshToken }),
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

  updateProject: (id: string, data: any) =>
    apiClient.put(`/project/${id}`, data),

  deleteProject: (id: string) => apiClient.delete(`/project/${id}`),
};

export const taskGroupsAPI = {
  getTaskGroups: () => apiClient.get('/taskgroups'),

  getTaskGroup: (id: string) => apiClient.get(`/taskgroups/${id}`),

  createTaskGroup: (data: any) => apiClient.post('/taskgroups', data),

  updateTaskGroup: (id: string, data: any) =>
    apiClient.put(`/taskgroups/${id}`, data),

  deleteTaskGroup: (id: string) => apiClient.delete(`/taskgroups/${id}`),
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),

  updateProfile: (data: any) => apiClient.put('/users/profile', data),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => apiClient.put('/users/change-password', data),

  getPreferences: () => apiClient.get('/users/preferences'),

  updatePreferences: (data: any) => apiClient.put('/users/preferences', data),
};

export default apiClient;
