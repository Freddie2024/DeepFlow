import TaskList from "@/src/components/taskList/TaskList";
import { useTasks } from "@/src/hooks/useTasks";

export default function AllTasksInDetailPage() {
  const { task, tasks, toggleTaskCompletion, editTask, deleteTask } =
    useTasks();
  return (
    <TaskList
      title="All tasks"
      tasks={tasks}
      onToggle={toggleTaskCompletion}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
}
