"use client";

import TaskCard from "../taskCard/TaskCard";
import styles from "./TaskList.module.css";

export default function TaskList({
  title,
  tasks = [],
  onToggle,
  onDelete,
  showDueDate = false,
}) {
  const taskArray = Array.isArray(tasks) ? tasks : [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      {taskArray.length > 0 ? (
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
