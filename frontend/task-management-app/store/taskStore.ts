import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// ── Constants ────────────────────────────────────────────────────────────────
const API_BASE_URL =
  'https://unrepeatable-squarrose-leanna.ngrok-free.dev/api/v1';

// ── Types ────────────────────────────────────────────────────────────────────
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'To do' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  dueTime?: string;
  parent?: {
    id: string;
    type: 'Project' | 'TaskGroup';
  };
  tags?: string[];
  isCompleted: boolean;
  completedAt?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  /** URL to the project logo image */
  logo?: string;
  /** ObjectId reference to the owning TaskGroup */
  taskGroup?: string;
  startDate: string;
  endDate: string;
  color?: string;
  taskCount?: number;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskGroup {
  id: string;
  name: string;
  /** Emoji or icon identifier */
  icon?: string;
  color?: string;
  taskCount?: number;
  completionPercentage?: number;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface TaskState {
  tasks: Task[];
  projects: Project[];
  taskGroups: TaskGroup[];
  isLoading: boolean;
  error: string | null;

  // Task methods
  fetchTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id'>) => Promise<ApiResponse<Task>>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<ApiResponse<Task>>;
  deleteTask: (id: string) => Promise<ApiResponse>;

  // Project methods
  fetchProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<ApiResponse<Project>>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<ApiResponse<Project>>;
  deleteProject: (id: string) => Promise<ApiResponse>;

  // TaskGroup methods
  fetchTaskGroups: () => Promise<void>;
  createTaskGroup: (group: Pick<TaskGroup, 'name' | 'icon' | 'color'>) => Promise<ApiResponse<TaskGroup>>;

  // Persistence
  loadFromStorage: () => Promise<void>;
  clearError: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Reads the auth token from AsyncStorage. Both authStore and taskStore use 'token'. */
const getToken = () => AsyncStorage.getItem('token');

const commonHeaders = async () => ({
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  Authorization: `Bearer ${await getToken()}`,
});

/**
 * Shape of a raw MongoDB document as returned by the backend.
 * MongoDB uses `_id`; we normalise it to `id` for consistency
 * across the frontend. The `parent` field only exists on Task documents.
 */
interface RawDoc {
  _id?: unknown;
  id?: string;
  parent?: {
    id?: unknown;
    type?: string;
  };
  [key: string]: unknown;
}

/**
 * Normalises a raw backend document so `_id` (MongoDB) becomes `id`
 * and the nested `parent.id` on Task documents is also normalised.
 *
 * Returns the same object cast to the caller's expected type T.
 */
function normalise<T>(raw: RawDoc): T {
  const doc: RawDoc = { ...raw };

  // Map MongoDB _id → id
  if (doc._id && !doc.id) {
    doc.id =
      typeof doc._id === 'object'
        ? (doc._id as { toString(): string }).toString()
        : String(doc._id);
  }

  // Normalise parent.id for Task documents
  if (doc.parent) {
    const pid = doc.parent.id;
    if (pid != null) {
      doc.parent = {
        ...doc.parent,
        id:
          typeof pid === 'object'
            ? (pid as { toString(): string }).toString()
            : String(pid),
      };
    }
  }

  return doc as unknown as T;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  projects: [],
  taskGroups: [],
  isLoading: false,
  error: null,

  // ── Persistence ────────────────────────────────────────────────────────
  loadFromStorage: async () => {
    try {
      const [tasksRaw, projectsRaw, groupsRaw] = await Promise.all([
        AsyncStorage.getItem('tasks'),
        AsyncStorage.getItem('projects'),
        AsyncStorage.getItem('taskGroups'),
      ]);
      set({
        tasks: tasksRaw ? JSON.parse(tasksRaw) : [],
        projects: projectsRaw ? JSON.parse(projectsRaw) : [],
        taskGroups: groupsRaw ? JSON.parse(groupsRaw) : [],
      });
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },

  clearError: () => set({ error: null }),

  // ── Tasks ──────────────────────────────────────────────────────────────
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: await commonHeaders(),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch tasks');

      const tasks: Task[] = (data.data ?? []).map((d: RawDoc) => normalise<Task>(d));
      set({ tasks, isLoading: false });
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      await get().loadFromStorage();
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: await commonHeaders(),
        body: JSON.stringify(taskData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create task');

      const newTask: Task = normalise<Task>(data.data as RawDoc);
      const updatedTasks = [...get().tasks, newTask];
      set({ tasks: updatedTasks, isLoading: false });
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { success: true, data: newTask };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: await commonHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to update task');

      const updatedTask: Task = normalise<Task>(data.data as RawDoc);
      const updatedTasks = get().tasks.map((t) =>
        t.id === id ? updatedTask : t
      );
      set({ tasks: updatedTasks, isLoading: false });
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { success: true, data: updatedTask };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: await commonHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete task');
      }

      const updatedTasks = get().tasks.filter((t) => t.id !== id);
      set({ tasks: updatedTasks, isLoading: false });
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  // ── Projects ───────────────────────────────────────────────────────────
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/project`, {
        headers: await commonHeaders(),
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || 'Failed to fetch projects');

      const projects: Project[] = (data.data ?? []).map((d: RawDoc) => normalise<Project>(d));
      set({ projects, isLoading: false });
      await AsyncStorage.setItem('projects', JSON.stringify(projects));
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      await get().loadFromStorage();
    }
  },

  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/project`, {
        method: 'POST',
        headers: await commonHeaders(),
        body: JSON.stringify(projectData),
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || 'Failed to create project');

      const newProject: Project = normalise<Project>(data.data as RawDoc);
      const updatedProjects = [...get().projects, newProject];
      set({ projects: updatedProjects, isLoading: false });
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      return { success: true, data: newProject };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/project/${id}`, {
        method: 'PUT',
        headers: await commonHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || 'Failed to update project');

      const updatedProject: Project = normalise<Project>(data.data as RawDoc);
      const updatedProjects = get().projects.map((p) =>
        p.id === id ? updatedProject : p
      );
      set({ projects: updatedProjects, isLoading: false });
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      return { success: true, data: updatedProject };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/project/${id}`, {
        method: 'DELETE',
        headers: await commonHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      const updatedProjects = get().projects.filter((p) => p.id !== id);
      // Also remove locally-cached tasks that belong to this project
      const updatedTasks = get().tasks.filter(
        (t) => !(t.parent?.id === id && t.parent?.type === 'Project')
      );
      set({ projects: updatedProjects, tasks: updatedTasks, isLoading: false });
      await Promise.all([
        AsyncStorage.setItem('projects', JSON.stringify(updatedProjects)),
        AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks)),
      ]);
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  // ── Task Groups ────────────────────────────────────────────────────────
  fetchTaskGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/taskgroups`, {
        headers: await commonHeaders(),
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || 'Failed to fetch task groups');

      const taskGroups: TaskGroup[] = (data.data ?? []).map((d: RawDoc) => normalise<TaskGroup>(d));
      set({ taskGroups, isLoading: false });
      await AsyncStorage.setItem('taskGroups', JSON.stringify(taskGroups));
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      await get().loadFromStorage();
    }
  },

  createTaskGroup: async (groupData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/taskgroups`, {
        method: 'POST',
        headers: await commonHeaders(),
        body: JSON.stringify(groupData),
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || 'Failed to create task group');

      const newGroup: TaskGroup = normalise<TaskGroup>(data.data as RawDoc);
      const updatedGroups = [...get().taskGroups, newGroup];
      set({ taskGroups: updatedGroups, isLoading: false });
      await AsyncStorage.setItem('taskGroups', JSON.stringify(updatedGroups));
      return { success: true, data: newGroup };
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },
}));