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

  const todayDate = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(new Date().getDate() + 1);
  const tomorrowDateString = tomorrowDate.toISOString().split("T")[0];

  if (!tasks || !slug) return <p>Loading page...</p>;

  const filteredTasks = tasks
    .filter((task) => {
      const taskDueDate = task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : null;

      if (slug === "today") {
        return taskDueDate === todayDate;
      } else if (slug === "tomorrow") {
        return taskDueDate === tomorrowDateString;
      } else if (slug === "someday") {
        return taskDueDate === null;
      } else if (slug === "later") {
        const taskDateObj = task.dueDate ? new Date(task.dueDate) : null;
        const todayDateObj = new Date(todayDate);
        return taskDateObj && taskDateObj > todayDateObj;
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
    someday: "No tasks so far.",
    later: "No upcoming tasks scheduled. Add tasks with specific future dates!",
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
            } else if (slug === "later") {
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
