import React, { useState, useEffect } from 'react';
import './App.css';
import { getTodos, createTodo, removeTodo } from './util';

const App = () => {
  const [todo, setTodo] = useState({
    description: '',
  });
  const [todoList, setTodoList] = useState();
  const [error, setError] = useState();

  // fetchTodos: Uses getTodos from util
  const fetchTodos = async () => {
    const res = await getTodos();
    if (res.error) {
      setError(res.error.name);
    }
    setTodoList(res.data);
  };

  // handleSubmit: Uses createTodo from util
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();
    const data = new FormData(e.currentTarget);
    try {
      data.set('description', todo.description);
      data.set('created_at', `${new Date().toISOString()}`);
      const newTodo = await createTodo(data);
      if (newTodo.error) {
        setError(newTodo.error);
      }
      setTodo({ description: '' });
      fetchTodos();
    } catch (err) {
      setError(err);
    }
  };

  // handleDelete: Uses removeTodo from uti
  const handleDelete = async (id) => {
    try {
      await removeTodo(id);
      fetchTodos();
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <div className="App">
      <main className="card">
        <h1>To-Do List</h1>
        <p className="subtitle">Click a task to remove it</p>
        <form className="todo-form" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Add a new task…"
            aria-label="New task"
            value={todo.description}
            onChange={(event) =>
              setTodo({ ...todo, description: event.target.value })
            }
          ></input>
          <button type="submit">Add Todo</button>
        </form>
        {error && <p className="error">{error}</p>}

        {todoList?.length === 0 ? (
          <p className="empty">No tasks yet</p>
        ) : (
          <ol className="todo-list">
            {todoList?.map((todoItem) => (
              <li
                key={todoItem.todo_id}
                className="todo-item"
                title="Click to remove"
                onClick={() => {
                  handleDelete(todoItem.todo_id);
                }}
              >
                {todoItem.description}
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
};

export default App;
