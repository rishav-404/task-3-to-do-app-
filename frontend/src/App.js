import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setTasks(res.data);
      setError('');
    } catch (err) {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async ({ title, description }) => {
    try {
      const res = await axios.post(API_URL, { title, description });
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="app-container">
      <div className="app-card">
        <h1 className="app-title">📝 To-Do List</h1>
        <p className="app-subtitle">MongoDB • Express • React • Node.js</p>

        <TaskForm onAddTask={handleAddTask} />

        {error && <p className="error-banner">{error}</p>}

        <div className="filter-bar">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="empty-state">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {!loading && tasks.length > 0 && (
          <p className="task-count">
            {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
