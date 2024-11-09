import { mockTasks } from "@/src/mockData"; // Change later
import TaskDetails from "@/src/components/taskDetails/TaskDetails";
import TaskList from "@/src/components/taskList/TaskList";

export default function AllTasksInDetailPage() {
  const { task, tasks, toggleTaskCompletion, editTask, deleteTask } =
    useTasks();
  return (
    <TaskList
      title="All tasks"
      tasks={mockTasks}
      onToggle={toggleTaskCompletion}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
}
