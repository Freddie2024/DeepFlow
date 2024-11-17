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

  const getDurationLabel = (priority) => {
    switch (priority) {
      case "long":
        return "3 hours";
      case "medium":
        return "1 hour";
      case "short":
        return "20 min";
      default:
        return "";
    }
  };

  const getDurationClass = (priority) => {
    switch (priority) {
      case "long":
        return styles.durationLong;
      case "medium":
        return styles.durationMedium;
      case "short":
        return styles.durationShort;
      default:
        return "";
    }
  };

  return (
    <div className={styles.cardContainer}>
      <li className={styles.card}>
        <div className={styles.topRow}>
          {showDueDate && (
            <p className={`${styles.dueDateLabel} ${dueDateClass}`}>
              {dueDateLabel}
            </p>
          )}
          <p
            className={`${styles.durationLabel} ${getDurationClass(
              task.priority
            )}`}
          >
            {getDurationLabel(task.priority)}
          </p>
          <div className={styles.viewDetailsLink}>
            <Link href={`/tasks/${task._id}`}>Details</Link>
          </div>
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
    </div>
  );
}
