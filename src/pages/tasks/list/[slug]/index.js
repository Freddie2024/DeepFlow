import TaskList from "@/src/components/taskList/TaskList";
import { useRouter } from "next/router";
import { useTasks } from "@/src/hooks/useTasks";
import TaskForm from "@/src/components/taskForm/TaskForm";
import { useEffect, useState, useCallback } from "react";

export default function TasksByDate() {
  const {
    tasks,
    loading,
    toggleTaskCompletion,
    editTask,
    deleteTask,
    addNewTask,
  } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState([]);

  const router = useRouter();
  const { slug } = router.query;

  const todayDate = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(new Date().getDate() + 1);
  const tomorrowDateString = tomorrowDate.toISOString().split("T")[0];

  const dueOptionMap = {
    today: "today",
    tomorrow: "tomorrow",
    later: "later",
    someday: "someday",
  };

  const defaultDueOption = dueOptionMap[slug] || "today";

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

  const filterTasks = useCallback(() => {
    return tasks
      ? tasks
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
              return taskDueDate && taskDueDate > tomorrowDateString;
            }
            return false;
          })
          .map((task) => ({
            ...task,
            duration: formatDuration(task.priority),
          }))
      : [];
  }, [tasks, slug, todayDate, tomorrowDateString]);

  useEffect(() => {
    if (!loading) {
      setFilteredTasks(filterTasks());
    }
  }, [tasks, filterTasks, loading]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTask = Object.fromEntries(formData);

    const dueDate = getDueDateBySlug(slug);
    if (dueDate !== null || slug !== "later") {
      newTask.dueDate = dueDate;
    } else if (slug === "later" && !newTask.dueDate) {
      alert("Please select a specific future date in the form.");
      return;
    }

    await addNewTask(newTask);
    setFilteredTasks(filterTasks());
  };

  const handleEditTask = async (updatedTask) => {
    await editTask(updatedTask);
    setFilteredTasks(filterTasks());
  };

  const getDueDateBySlug = (slug) => {
    if (slug === "today") return todayDate;
    if (slug === "tomorrow") return tomorrowDateString;
    if (slug === "someday") return null;
    return null;
  };

  const emptyMessage = {
    today:
      "Create 6 tasks you want to focus on today: 1 major, 2 medium, 3 small ones with a total of 6 hours.",
    tomorrow:
      "Create 6 tasks you want to focus on tomorrow: 1 major, 2 medium, 3 small ones with a total of 6 hours.",
    someday:
      "Set aside tasks you want to complete someday but that are not urgent.",
    later: "No upcoming tasks scheduled. Add tasks with specific future dates!",
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <>
      <h2>Tasks for {slug}</h2>
      {filteredTasks.length > 0 ? (
        <TaskList
          title={`Tasks for ${slug}`}
          tasks={filteredTasks}
          onToggle={toggleTaskCompletion}
          onEdit={handleEditTask}
          onDelete={deleteTask}
        />
      ) : (
        <>
          <p>{emptyMessage[slug] || "No tasks available."}</p>
          <TaskForm
            onSubmit={handleFormSubmit}
            defaultDueOption={defaultDueOption}
          />
        </>
      )}
    </>
  );
}
