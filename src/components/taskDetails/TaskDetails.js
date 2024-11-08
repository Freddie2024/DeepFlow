import styles from "./TaskDetails.module.css";

export default function TaskDetails({ task, tasks }) {
  const tasksToRender = tasks || (task ? [task] : []);

  return (
    <section aria-label="Task Details">
      {tasksToRender.map((task) => (
        <article key={task._id} className={styles.card}>
          <header className={styles.cardTitle}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={task.completed}
              onChange={() => handleToggleCompleted(task._id)}
              aria-label="Mark task as completed"
            />
            <h2>{task.title}</h2>
          </header>
          <p className={styles.cardDescription}>{task.description}</p>
          <footer className={styles.cardDetails}>
            <span>Duration: {task.duration}</span>
            <span className={styles.priority}>Priority: {task.priority}</span>
          </footer>
          <nav className={styles.buttonContainer} aria-label="Task Actions">
            <button
              className={styles.editButton}
              onClick={() => handleEdit(task._id)}
              aria-label="Edit task"
            >
              Edit
            </button>
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
