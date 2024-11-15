"use client";

import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export function useTasks() {
  const { data: session } = useSession();
  const router = useRouter();
  console.log("Session in useTasks:", session?.user?.userId);

  const {
    data: tasks,
    error,
    mutate,
    loading,
  } = useSWR(
    session?.user?.userId ? `/api/tasks/${session.user.userId}` : null
  );
  // const loading = !tasks && !error;
  console.log("TASKS", tasks);
  const addNewTask = async (newTask) => {
    // console.log("newTask::::::", newTask);
    try {
      // await mutate(async (currentTasks = []) => {
      //   console.log("New Task:", newTask);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newTask, userId: session.user.userId }),
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Failed to add task:", errorDetails);
        throw new Error("Failed to add task");
      }
      mutate();
      // const savedTask = await response.json();
      // return [...currentTasks, savedTask];
      //   }, false);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const editTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedTask, userId: session.user.userId }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      // mutate();
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    const task = tasks?.find((task) => task._id === taskId);
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
          userId: session.user.userId,
        }),
      });

      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.userId }),
      });
      if (response.ok) {
        mutate();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return {
    tasks: tasks || [],
    loading,
    error,
    addNewTask,
    editTask,
    toggleTaskCompletion,
    deleteTask,
    mutate,
  };
}

// async function fetchTasks(url) {
//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   if (!response.ok) throw new Error("Failed to fetch tasks");
//   return await response.json();
// }
