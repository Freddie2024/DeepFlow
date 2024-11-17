"use client";

import styles from "./TaskDetails.module.css";
import Link from "next/link";
import Button from "../button/Button";
import Label from "../label/Label";
import Card from "../card/Card";

export default function TaskDetails({ task, tasks, onToggle, onDelete }) {
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
        <Card key={task._id}>
          <div className={styles.topRow}>
            <Label type={task.priority} className={styles.durationLabel}>
              {formatDuration(task.priority)}
            </Label>
            <Label variant="details" className={styles.viewDetailsLink}>
              <Link href="/tasks/list/today">Back</Link>
            </Label>
          </div>

          <h3 className={styles.cardTitle}>{task.title}</h3>
          <p className={styles.cardDescription}>{task.description}</p>

          <nav className={styles.buttonContainer} aria-label="Task Actions">
            <Link href={`/tasks/${task._id}/edit`}>
              <Button variant="primary" aria-label="Edit task">
                Edit
              </Button>
            </Link>
            <Button variant="checkbox" as="label">
              <span>Done: </span>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={task.completed}
                onChange={() => onToggle(task._id)}
                aria-label="Mark task as completed"
              />
            </Button>
            <Button
              variant="delete"
              onClick={() => onDelete(task._id)}
              aria-label="Delete task"
            >
              Delete
            </Button>
          </nav>
        </Card>
      ))}
    </section>
  );
}
