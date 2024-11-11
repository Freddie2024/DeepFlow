import Link from "next/link";
import styles from "./TaskCard.module.css";

export default function TaskCard({ task, onToggle, onDelete, showDueDate }) {
  const dueDateClass =
    task.dueDate === "today"
      ? styles.dueDateToday
      : task.dueDate === "tomorrow"
      ? styles.dueDateTomorrow
      : styles.dueDateSomeday;

  return (
    <li className={styles.card}>
      <div className={styles.topRow}>
        {showDueDate && (
          <p className={`${styles.dueDateLabel} ${dueDateClass}`}>
            {task.dueDate === "today" && "Today"}
            {task.dueDate === "tomorrow" && "Tomorrow"}
            {task.dueDate === "someday" && "Someday"}
          </p>
        )}
        <Link href={`/tasks/${task._id}`}>
          <span className={styles.viewDetailsLink}>View Details</span>
        </Link>
      </div>

      <h2 className={styles.cardTitle}>{task.title}</h2>

      <div className={styles.buttonContainer} aria-label="Task Actions">
        <Link href={`/tasks/${task._id}/edit`}>
          <button className={styles.editButton} aria-label="Edit task">
            Edit
          </button>
        </Link>
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
          onClick={() => onDelete(task._id)}
          className={styles.deleteButton}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
