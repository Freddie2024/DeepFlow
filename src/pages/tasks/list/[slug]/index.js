import TaskList from "@/src/components/taskList/TaskList";
import { useRouter } from "next/router";
import { useTasks } from "@/src/hooks/useTasks";
import TaskForm from "@/src/components/taskForm/TaskForm";

export default function TasksByDate() {
  const { tasks, toggleTaskCompletion, editTask, deleteTask, addNewTask } =
    useTasks();
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

  if (!tasks) return <p>Loading tasks...</p>;

  const filteredTasks = tasks
    .filter((task) => task.dueDate === slug)
    .map((task) => ({
      ...task,
      duration: formatDuration(task.priority),
    }));

  const emptyMessage = {
    today:
      "Create 6 tasks you want to focus on today: 1 major, 2 medium, 3 small ones with a total of 6 hours.",
    tomorrow:
      "Create 6 tasks you want to focus on tomorrow: 1 major, 2 medium, 3 small ones with a total of 6 hours.",
    someday: "No tasks so far. Create your first task to get started!",
  };

  if (filteredTasks.length === 0) {
    return (
      <>
        <h2>Tasks for {slug}</h2>
        <p>{emptyMessage[slug] || "No tasks available."}</p>
        <TaskForm
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const newTask = Object.fromEntries(formData);
            newTask.dueDate = slug;
            await addNewTask(newTask);
          }}
        />
      </>
    );
  }

  return (
    <TaskList
      title={`Tasks for ${slug}`}
      tasks={filteredTasks}
      onToggle={toggleTaskCompletion}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
}
