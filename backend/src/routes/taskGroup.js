import { Router } from 'express';
import {
  getTaskGroups,
  getTaskGroup,
  createTaskGroup,
  updateTaskGroup,
  deleteTaskGroup,
} from '../controllers/taskGroup.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createTaskGroupSchema,
  updateTaskGroupSchema,
} from '../validations/taskGroup.validation.js';
import validate from '../middleware/validateMiddleware.js';

const router = Router();

router.get('/api/v1/taskgroups', authMiddleware, getTaskGroups);
router.get('/api/v1/taskgroups/:id', authMiddleware, getTaskGroup);
router.post(
  '/api/v1/taskgroups/',
  authMiddleware,
  validate(createTaskGroupSchema),
  createTaskGroup
);
router.put(
  '/api/v1/taskgroups/:id',
  authMiddleware,
  validate(updateTaskGroupSchema),
  updateTaskGroup
);
router.delete('/api/v1/taskgroups/:id', authMiddleware, deleteTaskGroup);

export default router;
