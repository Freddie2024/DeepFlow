"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTasks } from "@/src/hooks/useTasks";
import TaskForm from "@/src/components/taskForm/TaskForm";
import { useSession } from "next-auth/react";

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = router.query;
  const { tasks, editTask } = useTasks();
  const { data: session } = useSession();
  const [task, setTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <>
      <h2>Edit Task</h2>
      {isSaving && <p>Saving changes...</p>}
      <TaskForm
        onSubmit={handleEditTask}
        defaultData={task}
        isEditing={true}
        disabled={isSaving}
      />
    </>
  );
}
