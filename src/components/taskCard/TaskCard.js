import Link from "next/link";

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <li className="task-item">
      <h2>{task.title}</h2>
      <label>
        Done:
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task._id)}
        />
      </label>
      <button onClick={() => onEdit(task._id)}>Edit</button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
      <Link href={`/tasks/${task._id}`}>View Details</Link>
    </li>
  );
}
