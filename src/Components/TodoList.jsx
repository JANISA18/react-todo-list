import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import '../App.css';
const fakeAPI = {
  fetchTodos: () => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  },
  saveTodos: (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
};

const TodoItem = memo(({ todo, onMarkDone }) => {
  return (
    <li className={`todo-item ${todo.done ? 'done' : ''}`}>
      <span>{todo.text}</span>
      {!todo.done && (
        <button className="done-button" onClick={() => onMarkDone(todo.id)}>
          ✓
        </button>
      )}
    </li>
  );
});

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const isInitialLoad = useRef(true); // avoid saving immediately

  // Load from localStorage once on mount
  useEffect(() => {
    const loaded = fakeAPI.fetchTodos();
    setTodos(loaded);
  }, []);

  // Save to localStorage only after initial load
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    fakeAPI.saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback(() => {
    if (newTodo.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: newTodo.trim(),
      done: false
    };

    setTodos((prev) => [...prev, newTask]);
    setNewTodo('');
  }, [newTodo]);

  const markAsDone = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: true } : todo))
    );
  }, []);

  return (
    <div className="todo-container">
      <h2 className="title">Janice's To-Do List</h2>

      <div className="input-group">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTodo}>Add Task</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onMarkDone={markAsDone} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;