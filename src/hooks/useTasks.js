"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";

export function useTasks() {
  const { data: session, status } = useSession();

  const {
    data: tasks,
    error,
    mutate,
  } = useSWR(
    session?.user?.userId ? `/api/tasks/${session.user.userId}` : null
  );

  const loading = status === "loading" || (!tasks && !error);

  const addNewTask = async (newTask) => {
    console.log("addNewTask - Received newTask:", newTask);

    if (!session || !session.user?.userId) {
      console.error("Session or userId is not available");
      return;
    }

    const taskData = { ...newTask, userId: session.user.userId };
    console.log("addNewTask - Final taskData with userId:", taskData);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Failed to add task:", errorDetails);
        throw new Error("Failed to add task");
      }

      mutate();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const editTask = async (taskId, updatedTask) => {
    console.log("Editing task:", { taskId, updatedTask });

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
      // mutate(); CHECK IF THIS IS NEEDED!!!
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
          // userId or taskId ???????????????? CHECK!!!!
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
    console.log("Deleting task:", taskId);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error("Failed to delete task");
        throw new Error("Failed to delete task");
      }
      console.log("Task deleted successfully");

      mutate();
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
