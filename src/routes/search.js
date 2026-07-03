import express from 'express';
import * as store from '../store/taskStore.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({ error: 'status query parameter is required' });
  }

  const results = store.getAll().filter((task) => task.status !== status);
  res.json(results);
});

export default router;
