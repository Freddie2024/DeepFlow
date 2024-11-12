import TaskCard from "../taskCard/TaskCard";
import styles from "./TaskList.module.css";

export default function TaskList({
  title,
  tasks = [],
  onToggle,
  // onEdit,
  onDelete,
  showDueDate = false,
}) {
  console.log("onDelete prop in TaskList:", onDelete);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={onToggle}
            // onEdit={onEdit}
            onDelete={onDelete}
            showDueDate={showDueDate}
          />
        ))}
      </ul>
    </div>
  );
}
