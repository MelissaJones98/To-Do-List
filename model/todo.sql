CREATE DATABASE todo;

-- switch into the new database so the table is created there (psql only)
\c todo

CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(225) NOT NULL 
);