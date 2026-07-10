import React, { useState } from 'react';

function TaskItem({ task, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleToggleComplete = () => {
    onUpdateTask(task._id, { completed: !task.completed });
  };

  const handleEditSave = () => {
    if (!editTitle.trim()) return;
    onUpdateTask(task._id, { title: editTitle, description: editDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="task-item editing">
        <div className="task-edit-fields">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="task-input"
            autoFocus
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="task-input task-desc-input"
            placeholder="Description (optional)"
          />
        </div>
        <div className="task-actions">
          <button className="btn btn-save" onClick={handleEditSave}>
            Save
          </button>
          <button className="btn btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="task-checkbox"
        />
        <div className="task-text">
          <span className="task-title">{task.title}</span>
          {task.description && <p className="task-description">{task.description}</p>}
        </div>
      </div>
      <div className="task-actions">
        <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={() => onDeleteTask(task._id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
