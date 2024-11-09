import TaskList from "@/src/components/taskList/TaskList";
// import { mockTasks } from "@/src/mockData";
import { useTasks } from "@/src/hooks/useTasks";

export default function Today() {
  const { tasks, toggleTaskCompletion, editTask, deleteTask } = useTasks();

  if (!tasks.length) {
    return <p>Loading tasks...</p>;
  }

  console.log("Tasks:", tasks);

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

  const todaysTasks = tasks
    .filter((task) => task.dueDate === "today")
    .map((task) => ({
      ...task,
      duration: formatDuration(task.priority),
    }));

  return (
    <TaskList
      title="Tasks for today"
      tasks={todaysTasks}
      onToggle={toggleTaskCompletion}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
}
