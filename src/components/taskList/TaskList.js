import Link from "next/link";
import TaskCard from "../taskCard/TaskCard";

export default function TaskList({ tasks = [], onToggle, onEdit, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
