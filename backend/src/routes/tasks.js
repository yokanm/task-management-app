// routes/tasks.js - FIXED VERSION
import { Router } from 'express';
import {
  getTasks,
  createTask,
  getTodayTasks,
  getTaskStats,
  getTasksByStatus,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskStatusSchema,
} from '../validations/tasks.validation.js';

const router = Router();

router.get('/api/v1/tasks', authMiddleware, getTasks);
router.get('/api/v1/tasks/today', authMiddleware, getTodayTasks);
router.get('/api/v1/tasks/stats', authMiddleware, getTaskStats);
router.get(
  '/api/v1/tasks/status/:status',
  authMiddleware,
  validate(taskStatusSchema),
  getTasksByStatus
);
router.get(
  '/api/v1/tasks/:id',
  authMiddleware,
  validate(taskIdSchema),
  getTaskById
);

router.post(
  '/api/v1/tasks',
  authMiddleware,
  validate(createTaskSchema),
  createTask
);

router.put(
  '/api/v1/tasks/:id',
  authMiddleware,
  validate(updateTaskSchema),
  updateTask
);
router.delete(
  '/api/v1/tasks/:id',
  authMiddleware,
  validate(taskIdSchema),
  deleteTask
);

export default router;
