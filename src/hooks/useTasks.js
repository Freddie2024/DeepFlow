import useSWR from "swr";

export function useTasks() {
  const { data: tasks, error, mutate } = useSWR("/api/tasks", fetchTasks);

  const addNewTask = async (newTask) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        mutate();
      } else {
        console.error("Failed to add task:", await response.json());
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const editTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (response.ok) {
        mutate();
      }
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
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
      });
      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return {
    tasks,
    error,
    addNewTask,
    editTask,
    toggleTaskCompletion,
    deleteTask,
    mutate,
  };
}

async function fetchTasks() {
  const response = await fetch("/api/tasks");
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return await response.json();
}
