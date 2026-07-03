# Candidate Brief — Task Manager API

## Your task

You've just joined a team that owns a small Task Manager REST API. A batch of changes was merged right before the previous developer left, and the app is now broken in several ways. Your job is to get it back to the expected behavior described below.

You have **1 hour**. Fix the existing code in place — do not rewrite the project from scratch, swap frameworks, or add new features. You're encouraged to test as you go (curl, Postman, a browser — whatever you prefer) and to think out loud while you work.

## Expected behavior

Tasks are stored in memory and look like this:

```json
{ "id": 2, "title": "Write API documentation", "status": "pending", "createdAt": "2026-06-29T14:30:00.000Z" }
```

Valid statuses are `pending` and `done`. The store starts with three seeded tasks.

| Method | Path                       | Expected behavior                                                        |
| ------ | -------------------------- | ------------------------------------------------------------------------ |
| GET    | `/tasks`                   | Returns all tasks                                                        |
| GET    | `/tasks/:id`               | Returns the task with that id, or 404 if it doesn't exist                |
| POST   | `/tasks`                   | Creates a task, returns **201 with the created task** (including its id) |
| PUT    | `/tasks/:id`               | Updates `title` and/or `status` (partial updates allowed), returns the updated task, 404 if missing |
| DELETE | `/tasks/:id`               | Deletes the task, returns 204; returns 404 if it doesn't exist           |
| GET    | `/tasks/search?status=...` | Returns only the tasks **matching** that status                          |

## Reported symptoms

This is the bug report as filed by QA. Symptoms are listed in the order they were noticed — not necessarily the order you should fix them in, and there is no guarantee each symptom maps to exactly one cause.

1. **The server won't start at all.** `npm start` exits immediately with an error. (There may be more than one thing preventing startup — keep going until it boots.)
2. **Fetching any single task fails.** `GET /tasks/1` returns `404 Task not found`, even though task 1 is clearly visible in `GET /tasks`.
3. **Creating a task returns a success status but an empty body.** `POST /tasks` responds `201` with `{}` instead of the created task. The task does show up in the list a moment later, though.
4. **Status updates don't stick.** Sending `PUT /tasks/2` with `{"status": "done"}` returns 200, but the task is still `pending`. Even stranger: renaming a task seems to mess up its status.
5. **Deleting a task that doesn't exist "succeeds" — and breaks something else.** `DELETE /tasks/999` returns 204, and afterwards one of the real tasks has vanished from the list.
6. **Search returns exactly the wrong tasks.** `GET /tasks/search?status=done` returns the pending tasks, and vice versa. No error, just the opposite of what was asked for.

## What we're looking for

- Get the server running, then work through the symptoms.
- Verify each fix by actually hitting the endpoint, not just by reading the code.
- Small, targeted fixes. The structure of the app is fine — the bugs are in the details.

Good luck!
