import useSWR from "swr";

export function useTasks() {
  const { data: tasks, error, mutate } = useSWR("/api/tasks", fetchTasks);

  const loading = !tasks && !error;

  const addNewTask = async (newTask) => {
    try {
      await mutate(async (currentTasks) => {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });
        if (!response.ok) throw new Error("Failed to add task");

        const savedTask = await response.json();
        return [...currentTasks, savedTask];
      }, false);
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
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return {
    tasks,
    loading,
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
