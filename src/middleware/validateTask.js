const VALID_STATUSES = ['pending', 'done'];

function validateTask(req, res, next) {
  const { title, status } = req.body;

  if (req.method === 'POST' && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  next();
}

export default validateTask;
