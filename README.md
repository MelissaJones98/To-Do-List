# To Do List

## Description

A Codecademy off-platform project. A simple to do list web application leveraging the MVC architecture. This web application allows users to add a new task to their to do list.
Users will be able to remove tasks from the list once they have been completed by clicking on the list item.

## Features

- Add a new task to the to do list
- View all saved tasks, stored in a PostgreSQL database
- Remove a completed task by clicking on it

## Wireframe

(add wireframe here)

## Project Structure

The app is split into two parts that run as **separate servers**:

| Folder                                                | What it is                            | Port   |
| ----------------------------------------------------- | ------------------------------------- | ------ |
| root (`index.js`, `routes/`, `controller/`, `model/`) | Express REST API (Model + Controller) | `8000` |
| `view/`                                               | React frontend (View)                 | `3000` |

```
Browser ──► localhost:3000 (React, view/) ──proxy──► localhost:8000 (Express API) ──► PostgreSQL
```

The React dev server forwards any `/api/...` request to the API using the `"proxy"` setting in `view/package.json`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [PostgreSQL](https://www.postgresql.org/download/), with the `psql` command available

### 1. Install dependencies

Both parts have their own `package.json`, so install in both folders:

```
npm install
cd view
npm install
cd ..
```

### 2. Set up the database

Run the schema script with `psql`. It creates a `todo` database and a `todo` table inside it:

```
psql -U <your-postgres-user> -f model/todo.sql
```

> The script uses `\c todo`, which is a psql command. It will not work in GUI tools like pgAdmin; there, create the database, connect to it, then run the `CREATE TABLE` statement.
>
> The script only needs to run once. Running it again fails because the database already exists.

### 3. Create the root `.env` file

Create a file called `.env` in the project root with your database connection details:

```
DB_USER=<your-postgres-user>
DB_PASSWORD=<your-postgres-password>
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=todo
```

This file is ignored by git, so your password is never committed. `PORT` can also be set here to change the API port (default `8000`).

`view/.env` is already in the repo and does not need changing (see [Troubleshooting](#troubleshooting)).

### 4. Run the app

The app needs **two terminals running at the same time**.

**Terminal 1: API**, from the project root:

```
npm start
```

Wait for `App listening at http://localhost:8000`.

**Terminal 2: frontend**, from the `view/` folder:

```
cd view
npm start
```

Wait for `Compiled successfully!` (20–40 seconds the first time). Your browser should open automatically; if not, go to **http://localhost:3000**.

## How to Use

1. Start both servers (see [Run the app](#4-run-the-app)) and open http://localhost:3000.
2. Type a task into the input box and click **Add Todo** (or press Enter). The task is saved and appears in the numbered list.
3. Click on a task once it is completed to remove it from the list.
4. If something goes wrong (for example, submitting an empty task), an error message appears in red below the input box.

## API Endpoints

| Method   | Endpoint           | Description                                  |
| -------- | ------------------ | -------------------------------------------- |
| `GET`    | `/api/todos`       | Returns all tasks                            |
| `POST`   | `/api/todo/create` | Adds a task. Send `description` as form data |
| `DELETE` | `/api/todo/:id`    | Removes the task with that `todo_id`         |

Quick check that the API and database are working:

```
curl http://localhost:8000/api/todos
```

Expected response: `{"data":[]}` (or your saved tasks).

## Available Scripts

### Root folder

| Command     | What it does                                                     |
| ----------- | ---------------------------------------------------------------- |
| `npm start` | Starts the API with `nodemon`, which restarts it on code changes |

### `view/` folder

| Command         | What it does                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm start`     | Starts the React dev server on http://localhost:3000. The page reloads on changes                                        |
| `npm test`      | Runs the frontend tests in watch mode. Note: `App.test.js` is still the Create React App sample test and currently fails |
| `npm run build` | Creates an optimised production build in `view/build`                                                                    |

## Troubleshooting

| Symptom                                                                           | Cause                                             | Fix                                                                                                      |
| --------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `localhost:3000` "can't be reached"                                               | The frontend isn't running                        | Run `npm start` inside `view/` in a second terminal                                                      |
| `localhost:8000` shows `Cannot GET /`                                             | Expected: the API has no page at `/`              | Open http://localhost:3000 instead                                                                       |
| `options.allowedHosts[0] should be a non-empty string` when starting the frontend | Known `react-scripts` 5 bug when `"proxy"` is set | Make sure `view/.env` exists and contains `DANGEROUSLY_DISABLE_HOST_CHECK=true` (local development only) |
| `EADDRINUSE: address already in use :::8000`                                      | Another server is already using port 8000         | Close the other terminal running the API                                                                 |
| API error code `42P01`                                                            | The `todo` table doesn't exist in the database    | Run `model/todo.sql` (see [step 2](#2-set-up-the-database))                                              |
| API error code `3D000`                                                            | The database in `DB_DATABASE` doesn't exist       | Check `.env` and run `model/todo.sql`                                                                    |

## Technologies

- REST API
- Node.js and Express
- PostgreSQL (`pg`)
- React (Create React App)
- formidable (parses form data sent to the API)
- dotenv (loads database settings from `.env`)
- nodemon (restarts the API on code changes)
- ESLint (Airbnb style guide) and Prettier
- Command Line

## Error Handling and Testing

Implemented error handling for:

- Missing task description
- Database errors
- Failed requests in the frontend

### Missing task description

`POST /api/todo/create` checks that a `description` field was sent. If it is missing or empty, the API responds with status `400` and `{"error": "Description is required"}` without touching the database.

### Database errors

Every controller function (`create`, `read`, `removeTodo` in `controller/index.js`) wraps its database query in `try/catch`. If the query fails, for example because the database or table doesn't exist, the API responds with status `400` and the error details instead of crashing the server.

### Failed requests in the frontend

The request helpers in `view/src/util/index.js` catch network errors and return them as `{ error }` instead of throwing. `App.js` checks for an `error` in each response and shows it in red under the input box. The error is cleared each time a new task is submitted.

### Testing

The API was tested manually with `curl` (see [API Endpoints](#api-endpoints)) by creating, reading and deleting a task.

## Future Work
