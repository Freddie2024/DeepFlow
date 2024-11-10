import TaskList from "@/src/components/taskList/TaskList";
import { mockTasks } from "@/src/mockData";
import { useTasks } from "@/src/hooks/useTasks";

export default function Tomorrow() {
  const { task, tasks, toggleTaskCompletion, editTask, deleteTask } =
    useTasks();
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

  const tomorrowsTasks = mockTasks
    .filter((task) => task.dueDate === "tomorrow")
    .map((task) => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      duration: formatDuration(task.priority),
    }));

  return (
    <TaskList
      title="Tasks for tomorrow"
      tasks={tomorrowsTasks}
      onToggle={toggleTaskCompletion}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
}
