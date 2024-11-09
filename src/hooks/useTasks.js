import { useState, useEffect } from "react";
// import { mockTasks } from "@/src/mockData"; // Change later

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  //   const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"; // Change later to false in .env

  useEffect(() => {
    // if (useMockData) {
    //   setTasks(mockTasks);
    // } else {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks from MongoDB:", error);
      }
    }

    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const editTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...updatedTask } : task
          )
        );
      }
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find((task) => task._id === taskId);
      if (!task) return;

      const updatedTask = { completed: !task.completed };

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? { ...task, completed: updatedTask.completed }
              : task
          )
        );
      } else {
        console.error("Failed to update task in the database.");
      }
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return {
    tasks,
    addTask,
    editTask,
    toggleTaskCompletion,
    deleteTask,
  };
}
