import Link from "next/link";
import { mockTasks } from "@/src/mockData";

export default function TaskList({ tasks = [] }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => {
        return (
          <li key={task._id} className="task-item">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Duration: {task.duration}</p>
            <Link href={`/tasks/${task._id}`}>View Details</Link>
          </li>
        );
      })}
    </ul>
  );
}
