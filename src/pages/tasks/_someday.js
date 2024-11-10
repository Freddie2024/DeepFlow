import TaskList from "@/src/components/taskList/TaskList";
import { mockTasks } from "@/src/mockData";
import { useTasks } from "@/src/hooks/useTasks";

export default function Someday() {
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

  const somedaysTasks = mockTasks
    .filter((task) => task.dueDate === "someday")
    .map((task) => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      duration: formatDuration(task.priority),
    }));

  return (
    <TaskList
      title="Tasks for someday"
      tasks={somedaysTasks}
      onToggle={toggleTaskCompletion}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
}
