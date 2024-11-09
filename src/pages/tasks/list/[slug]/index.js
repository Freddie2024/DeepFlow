import TaskList from "@/src/components/taskList/TaskList";
import { useRouter } from "next/router";
import { useTasks } from "@/src/hooks/useTasks";

export default function TasksByDate() {
  const { tasks, toggleTaskCompletion, editTask, deleteTask } = useTasks();
  const router = useRouter();
  const { slug } = router.query;

  const formatDuration = (priority) => {
    switch (priority) {
      case "long":
        return "3 hours";
      case "medium":
        return "1 hour";
      case "short":
        return "20 minutes";
      default:
        return "unknown";
    }
  };

  const filteredTasks = tasks
    .filter((task) => task.dueDate === slug)
    .map((task) => ({
      ...task,
      duration: formatDuration(task.priority),
    }));

  const title = `Tasks for ${slug}`;

  return (
    <TaskList
      title={title}
      tasks={filteredTasks}
      onToggle={toggleTaskCompletion}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
}
