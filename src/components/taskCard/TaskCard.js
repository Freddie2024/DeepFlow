"use client";

import Link from "next/link";
import styles from "./TaskCard.module.css";
import Button from "../button/Button";
import Label from "../label/Label";
import Card from "../card/Card";
import { ArrowRight, Edit2, Check, Trash2 } from "lucide-react";

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
    <Card>
      <li>
        <div className={styles.topRow}>
          {showDueDate && (
            <Label
              variant={
                taskDueDateString === todayDate
                  ? "today"
                  : taskDueDateString === tomorrowDateString
                  ? "tomorrow"
                  : "later"
              }
              className={styles.dueDateLabel}
            >
              {dueDateLabel}
            </Label>
          )}
          <Label type={task.priority} className={styles.durationLabel}>
            {getDurationLabel(task.priority)}
          </Label>
          <Label variant="details" className={styles.viewDetailsLink}>
            <Link href={`/tasks/${task._id}`}>
              <ArrowRight size={18} />
            </Link>
          </Label>
        </div>

        <h2 className={styles.cardTitle}>{task.title}</h2>

        <div className={styles.buttonContainer} aria-label="Task Actions">
          <Link href={`/tasks/${task._id}/edit`}>
            <Button variant="primary" aria-label="Edit task" title="Edit task">
              <Edit2 size={18} />
            </Button>
          </Link>
          <Button variant="checkbox" as="label" title="Mark as completed">
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
            title="Delete task"
          >
            <Trash2 size={18} />{" "}
          </Button>
        </div>
      </li>
    </Card>
  );
}
