import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from '../controllers/project.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from '../validations/project.validation.js';
import {validate} from '../middleware/validateMiddleware.js';

const router = Router();

router.get('/api/v1/project', authMiddleware, getProjects);
router.get(
  '/api/v1/project/:id',
  authMiddleware,
  validate(projectIdSchema),
  getProject
);
router.post(
  '/api/v1/project',
  authMiddleware,
  validate(createProjectSchema),
  createProject
);
router.put(
  '/api/v1/project/:id',
  authMiddleware,
  validate(updateProjectSchema),
  updateProject
);
router.delete(
  '/api/v1/project/:id',
  authMiddleware,
  validate(projectIdSchema),
  deleteProject
);

export default router;
