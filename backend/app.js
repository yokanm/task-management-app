import express from 'express';
import authRouter from './src/routes/auth.js';
import tasksRouter from './src/routes/tasks.js';
import projectRouter from './src/routes/project.js';
import taskGroupRouter from './src/routes/taskGroup.js';
import userRouter from './src/routes/user.js'
import cookieParser from 'cookie-parser';
import { errorHandler } from './src/middleware/errorHandler.js';

export function serverApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(authRouter);
  app.use(tasksRouter);
  app.use(projectRouter);
  app.use(taskGroupRouter);
  app.use(userRouter)

  app.get('/api/v1/', (req, res) => {
    res.status(200).json({ msg: 'Hello' });
  });

  app.use(errorHandler);

  return app;
}
