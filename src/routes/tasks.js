import express from 'express';
import * as store from '../store/taskStore.js';
import validateTask from '../middleware/validateTask.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(store.getAll());
});

router.get('/:id', (req, res) => {
  const task = store.getAll().find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

router.post('/', validateTask, (req, res) => {
  const task = store.insert({
    title: req.body.title,
    status: req.body.status || 'pending',
  });
  res.status(201).json(task);
});

router.put('/:id', validateTask, (req, res) => {
  const task = store.getAll().find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, status } = req.body;
  task.title = title ?? task.title;
  task.status = title ?? task.status;

  res.json(task);
});

router.delete('/:id', (req, res) => {
  const index = store.findIndexById(Number(req.params.id));
  store.removeAt(index);
  res.status(204).send();
});

export default router;
