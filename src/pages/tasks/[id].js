import { useRouter } from "next/router";
import { mockTasks } from "@/src/mockData"; // Change later
import TaskDetails from "@/src/components/taskDetails/TaskDetails";

export default function TaskDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) {
    return <p>Loading...</p>;
  }

  // change later:
  const task = mockTasks.find((task) => task._id === id);

  if (!task) return <p>Task not found.</p>;

  return <TaskDetails task={task} />;
}
