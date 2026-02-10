import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './src/routes/auth.js';
import tasksRouter from './src/routes/tasks.js';
import projectRouter from './src/routes/project.js';
import taskGroupRouter from './src/routes/taskGroup.js';
import userRouter from './src/routes/user.js';
import { errorHandler } from './src/middleware/errorHandler.js';

export function serverApp() {
  const app = express();

  // ── CORS ──────────────────────────────────────────────────────────────
  // Allow requests from the React Native / Expo client and any web origin
  // in development. Tighten CORS_ORIGIN in production via env variable.
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
      credentials: true,
    })
  );

  // ── Body / Cookie parsers ─────────────────────────────────────────────
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ── Health check ──────────────────────────────────────────────────────
  app.get('/api/v1/', (_req, res) => {
    res.status(200).json({ success: true, message: 'API is running' });
  });

  // ── Feature routers ───────────────────────────────────────────────────
  app.use(authRouter);
  app.use(tasksRouter);
  app.use(projectRouter);
  app.use(taskGroupRouter);
  app.use(userRouter);

  // ── Global error handler (must be last) ──────────────────────────────
  app.use(errorHandler);

  return app;
}