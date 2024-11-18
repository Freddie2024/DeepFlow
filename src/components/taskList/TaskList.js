"use client";

import TaskCard from "../taskCard/TaskCard";
import styles from "./TaskList.module.css";

export default function TaskList({
  tasks = [],
  onToggle,
  onDelete,
  showDueDate = false,
}) {
  return (
    <div className={styles.container}>
      {tasks.length > 0 ? (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              showDueDate={showDueDate}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
