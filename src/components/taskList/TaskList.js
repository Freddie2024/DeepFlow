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
            {task._id ? (
              <Link href={`/tasks/${task._id}`}>View Details</Link>
            ) : (
              <span>No ID available</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
