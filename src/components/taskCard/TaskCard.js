import Link from "next/link";
import styles from "./TaskCard.module.css";

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <li className={styles.card}>
      <h2 className={styles.cardTitle}>{task.title}</h2>
      <Link href={`/tasks/${task._id}`}>
        <span className={styles.viewDetailsLink}>View Details</span>
      </Link>
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
