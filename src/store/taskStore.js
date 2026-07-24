const tasks = [
  { id: 1, title: 'Set up project repository', status: 'done', createdAt: '2026-06-28T09:15:00.000Z' },
  { id: 2, title: 'Write API documentation', status: 'pending', createdAt: '2026-06-29T14:30:00.000Z' },
  { id: 3, title: 'Review open pull requests', status: 'pending', createdAt: '2026-07-01T11:00:00.000Z' },
];

let nextId = 4;

export function getAll() {
  return tasks.map((task) => ({ ...task }));
}

export async function insert(data) {
  // Simulates the write latency of a real datastore.
  await new Promise((resolve) => setTimeout(resolve, 150));

  const task = {
    id: nextId,
    title: data.title,
    status: data.status,
    createdAt: new Date().toISOString(),
  };
  nextId += 1;
  tasks.push(task);
  return task;
}

export function findIndexById(id) {
  return tasks.findIndex((task) => task.id === id);
}

export function removeAt(index) {
  tasks.splice(index, 1);
}
