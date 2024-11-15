"use client";

import TaskList from "@/src/components/taskList/TaskList";
import { useRouter } from "next/router";
import { useTasks } from "@/src/hooks/useTasks";
import TaskForm from "@/src/components/taskForm/TaskForm";
import { useEffect, useState, useMemo, useRef } from "react";
import { useSession, getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function TasksByDate() {
  const { data: session } = useSession();

  console.log("Session on TasksByDate:", session);

  const {
    tasks,
    loading,
    toggleTaskCompletion,
    editTask,
    deleteTask,
    addNewTask,
  } = useTasks();
  console.log("TASKS IN TASKBYDATE", tasks);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const previousFilteredTasksRef = useRef(filteredTasks);
  const router = useRouter();
  const { slug } = router.query;

  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowDateString = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

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

  useEffect(() => {
    console.log("tasks:::", tasks);
    if (tasks) {
      const filtered = tasks
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
        }));
      console.log("filtered:::", filtered);
      if (
        JSON.stringify(previousFilteredTasksRef.current) !==
        JSON.stringify(filtered)
      ) {
        setFilteredTasks(filtered);
        previousFilteredTasksRef.current = filtered;
      }
    }
  }, [tasks, slug, todayDate, tomorrowDateString]);

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
    console.log("newTask", newTask);
    await addNewTask(newTask);
  };

  const handleEditTask = async (updatedTask) => {
    await editTask(updatedTask);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleToggleTaskCompletion = async (taskId) => {
    await toggleTaskCompletion(taskId);
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

  if (loading) return <p>Loading todays tasks...</p>;
  console.log("filteredTasks", filteredTasks);
  return (
    <>
      <h2>Tasks for {slug}</h2>
      {filteredTasks.length > 0 ? (
        <TaskList
          title={`Tasks for ${slug}`}
          tasks={filteredTasks}
          onToggle={handleToggleTaskCompletion}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
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
