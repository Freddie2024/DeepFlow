import { useState, useEffect } from "react";
import { mockTasks } from "@/src/mockData"; // Change later

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"; // Change later to false in .env

  useEffect(() => {
    if (useMockData) {
      setTasks(mockTasks);
    } else {
      async function fetchTasks() {
        try {
          const response = await fetch("/api/tasks"); // Check later if this is the actual API endpoint
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error("Failed to fetch tasks from MongoDB:", error);
        }
      }

      fetchTasks();
    }
  }, [useMockData]);

  const editTask = (taskId, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  return {
    tasks,
    editTask,
    toggleTaskCompletion,
    deleteTask,
  };
}
