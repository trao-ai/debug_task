# Task Manager API

A small REST API for managing tasks. Tasks are stored in memory — no database or configuration required.

## Getting started

```bash
npm install
npm start
```

For auto-restart on file changes during development, use `npm run dev` instead.

## Checking your progress

```bash
npm run check
```

Prints your progress, e.g. `4/9 fixed — 5 to go.` Run it as often as you like.

The server listens on port 3000 by default (override with the `PORT` environment variable).

## Endpoints

| Method | Path                        | Description                              |
| ------ | --------------------------- | ---------------------------------------- |
| GET    | `/tasks`                    | List all tasks                           |
| GET    | `/tasks/:id`                | Get a single task by id                  |
| POST   | `/tasks`                    | Create a task (`title` required, `status` optional) |
| PUT    | `/tasks/:id`                | Update a task's `title` and/or `status`  |
| DELETE | `/tasks/:id`                | Delete a task                            |
| GET    | `/tasks/search?status=...`  | List tasks matching a status (`pending` or `done`) |

## Task shape

```json
{
  "id": 1,
  "title": "Set up project repository",
  "status": "done",
  "createdAt": "2026-06-28T09:15:00.000Z"
}
```

Valid statuses are `pending` and `done`. The store is seeded with three tasks on startup.

## Testing the API

Import [`postman_collection.json`](postman_collection.json) into Postman (or any compatible client) for ready-made requests covering every endpoint.

Prefer the terminal? Equivalent curl commands:

```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks/1
curl -X POST http://localhost:3000/tasks -H 'Content-Type: application/json' -d '{"title":"My new task"}'
curl -X PUT http://localhost:3000/tasks/2 -H 'Content-Type: application/json' -d '{"status":"done"}'
curl -X DELETE http://localhost:3000/tasks/3
curl "http://localhost:3000/tasks/search?status=done"
```

Tip: add `-i` to any curl command to see the response status code and headers.
