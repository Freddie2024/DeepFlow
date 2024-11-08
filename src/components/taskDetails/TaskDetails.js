import styles from "./TaskDetails.module.css";

export default function TaskDetails({ task, tasks }) {
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
              onClick={() => handleEdit(task._id)}
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
                onChange={() => handleToggleCompleted(task._id)}
                aria-label="Mark task as completed"
              />
            </label>
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(task._id)}
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

function handleToggleCompleted(taskId) {
  console.log(`Toggle completed for task with ID: ${taskId}`);
}

function handleEdit(taskId) {
  console.log(`Edit task with ID: ${taskId}`);
}

function handleDelete(taskId) {
  console.log(`Delete task with ID: ${taskId}`);
}
