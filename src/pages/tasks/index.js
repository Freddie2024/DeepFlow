import { mockTasks } from "@/src/mockData"; // Change later
import TaskDetails from "@/src/components/taskDetails/TaskDetails";

export default function AllTasksInDetailPage() {
  return (
    <div>
      <h1>All Tasks</h1>
      <TaskDetails tasks={mockTasks} />
    </div>
  );
}
