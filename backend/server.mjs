import { serverApp } from './app.js';
import { connectDB } from './src/config/database.js';
import config from './src/config/index.js';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize app
    const app = serverApp();

    // Start server
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

startServer();
