"use client";

import Link from "next/link";
import styles from "./TaskCard.module.css";

export default function TaskCard({ task, onToggle, onDelete, showDueDate }) {
  const todayDate = new Date().toISOString().split("T")[0];

  const tomorrowDate = new Date();
  tomorrowDate.setDate(new Date().getDate() + 1);
  const tomorrowDateString = tomorrowDate.toISOString().split("T")[0];

  let dueDateLabel = "";
  let dueDateClass = "";

  const taskDueDateString = task.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : null;

  console.log("Task Due Date:", task.dueDate);
  console.log("Task Due Date String:", taskDueDateString);

  if (taskDueDateString === todayDate) {
    dueDateLabel = "Today";
    dueDateClass = styles.dueDateToday;
  } else if (taskDueDateString === tomorrowDateString) {
    dueDateLabel = "Tomorrow";
    dueDateClass = styles.dueDateTomorrow;
  } else if (!task.dueDate) {
    dueDateLabel = "Someday";
    dueDateClass = styles.dueDateSomeday;
  } else {
    dueDateLabel = new Date(task.dueDate).toLocaleDateString("de-DE");
    dueDateClass = styles.dueDateLater;
  }

  console.log("Processed Task Due Date:", {
    taskDueDate: task.dueDate,
    taskDueDateString,
    dueDateLabel,
  });

  return (
    <li className={styles.card}>
      <div className={styles.topRow}>
        {showDueDate && (
          <p className={`${styles.dueDateLabel} ${dueDateClass}`}>
            {dueDateLabel}
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
