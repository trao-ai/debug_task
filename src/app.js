import express from 'express';
import logger from './middleware/logger.js';
import searchRoutes from './routes/search.js';
import taskRoutes from './routes/task.js';

const app = express();

app.use(express.json());
app.use(logger);

app.use('/tasks/search', searchRoutes);
app.use('/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
