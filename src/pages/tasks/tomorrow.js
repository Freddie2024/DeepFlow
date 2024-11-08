import TaskList from "@/src/components/taskList/TaskList";
import { mockTasks } from "@/src/mockData";

export default function Tomorrow() {
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
    <>
      <h1>Tasks for tomorrow</h1>
      <TaskList tasks={tomorrowsTasks} />
    </>
  );
}
