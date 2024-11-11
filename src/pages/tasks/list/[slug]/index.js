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

  const todayDate = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(new Date().getDate() + 1);
  const tomorrowDateString = tomorrowDate.toISOString().split("T")[0];

  const filteredTasks = tasks
    .filter((task) => {
      if (slug === "today") {
        return task.dueDate === todayDate;
      } else if (slug === "tomorrow") {
        return task.dueDate === tomorrowDateString;
      } else if (slug === "someday") {
        return task.dueDate === null;
      } else if (slug === "later-date") {
        return task.dueDate && task.dueDate > todayDate;
      }
      return false;
    })
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
    "later-date":
      "No upcoming tasks scheduled. Add tasks with specific future dates!",
  };

  if (filteredTasks.length === 0) {
    return (
      <>
        <h2>No tasks for {slug}</h2>
        <p>{emptyMessage[slug] || "No tasks available."}</p>
        <TaskForm
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const newTask = Object.fromEntries(formData);

            if (slug === "today") {
              newTask.dueDate = todayDate;
            } else if (slug === "tomorrow") {
              newTask.dueDate = tomorrowDateString;
            } else if (slug === "someday") {
              newTask.dueDate = null;
            } else if (slug === "later-date") {
              alert("Please select a specific future date in the form.");
              return;
            }

            await addNewTask(newTask);
          }}
        />
      </>
    );
  }

  return (
    <TaskList
      title={`Tasks for ${slug.replace("-", " ")}`}
      tasks={filteredTasks}
      onToggle={toggleTaskCompletion}
      onEdit={editTask}
      onDelete={deleteTask}
    />
  );
}
