# Task Manager API

A small REST API for managing tasks. Tasks are stored in memory — no database or configuration required.

## Getting started

```bash
npm install
npm start
```

For auto-restart on file changes during development, use `npm run dev` instead.

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
