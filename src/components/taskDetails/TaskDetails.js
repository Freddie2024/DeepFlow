import styles from "./TaskDetails.module.css";
import { useState, useEffect } from "react";

export default function TaskDetails({
  task,
  tasks,
  onToggle,
  onEdit,
  onDelete,
}) {
  const formatDuration = (priority) => {
    switch (priority) {
      case "long":
        return "3 hours";
      case "medium":
        return "1 hour";
      case "short":
        return "20 minutes";
      default:
        return "unknown";
    }
  };
  const tasksToRender = tasks || (task ? [task] : []);

  return (
    <section aria-label="Task Details">
      {tasksToRender.map((task) => (
        <article key={task._id} className={styles.card}>
          <header className={styles.cardTitle}>
            <h3>{task.title}</h3>
          </header>
          <p className={styles.cardDescription}>{task.description}</p>
          <footer className={styles.cardDetails}>
            <span>Duration: {formatDuration(task.priority)}</span>
          </footer>
          <nav className={styles.buttonContainer} aria-label="Task Actions">
            <button
              className={styles.editButton}
              onClick={() => onEdit(task._id)}
              aria-label="Edit task"
            >
              Edit
            </button>
            <label className={styles.checkboxButton}>
              <span>Done: </span>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={task.completed}
                onChange={() => onToggle(task._id)}
                aria-label="Mark task as completed"
              />
            </label>
            <button
              className={styles.deleteButton}
              onClick={() => onDelete(task._id)}
              aria-label="Delete task"
            >
              Delete
            </button>
          </nav>
        </article>
      ))}
    </section>
  );
}