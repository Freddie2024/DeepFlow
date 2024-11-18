"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTasks } from "@/src/hooks/useTasks";
import TaskForm from "@/src/components/taskForm/TaskForm";

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = router.query;
  const { tasks, editTask } = useTasks();
  const [task, setTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const tasksForToday =
    tasks?.filter((t) => {
      if (!t.dueDate) return false;

      const taskDate = new Date(t.dueDate).toISOString().split("T")[0];
      const today = new Date().toISOString().split("T")[0];
      return taskDate === today && t._id !== id;
    }) || [];

  const tasksForTomorrow =
    tasks?.filter((t) => {
      if (!t.dueDate) return false;

      const taskDate = new Date(t.dueDate).toISOString().split("T")[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split("T")[0];
      return taskDate === tomorrowDate && t._id !== id;
    }) || [];

  useEffect(() => {
    if (id && tasks) {
      const foundTask = tasks.find((task) => task._id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        setError("Task not found");
      }
    }
  }, [id, tasks]);

  async function handleEditTask(taskData) {
    setIsSaving(true);
    setError(null);
    try {
      await editTask(id, taskData);
      await showSuccess("Success!", "Task updated successfully!");
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      router.back();
      setIsSaving(false);
    }
  }

  if (error) return <p>{error}</p>;
  if (!task) return <p>Loading task data...</p>;

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <h2>Edit Task</h2>
      {isSaving && <p>Saving changes...</p>}
      <TaskForm
        onSubmit={handleEditTask}
        defaultData={task}
        isEditing={true}
        onCancel={handleCancel}
        disabled={isSaving}
        tasksForToday={tasksForToday}
        tasksForTomorrow={tasksForTomorrow}
        currentTaskId={id}
      />
    </>
  );
}
