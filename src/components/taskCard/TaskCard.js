import Link from "next/link";
import styles from "./TaskCard.module.css";

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <li className={styles.card}>
      <h2 className={styles.cardTitle}>{task.title}</h2>
      <Link href={`/tasks/${task._id}`}>
        <span className={styles.viewDetailsLink}>View Details</span>
      </Link>
      <div className={styles.buttonContainer} aria-label="Task Actions">
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
