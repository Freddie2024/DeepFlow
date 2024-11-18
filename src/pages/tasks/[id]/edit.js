"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTasks } from "@/src/hooks/useTasks";
import TaskForm from "@/src/components/taskForm/TaskForm";
import { showSuccess, showWarning } from "@/src/lib/sweetAlertUtils";

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

  function getTaskCounts(tasks) {
    return {
      long: tasks.filter((t) => t.priority === "long").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      short: tasks.filter((t) => t.priority === "short").length,
    };
  }

  function calculateTotalTime(tasks, newTaskPriority) {
    const totalMinutes = tasks.reduce((total, task) => {
      switch (task.priority) {
        case "long":
          return total + 180;
        case "medium":
          return total + 60;
        case "short":
          return total + 20;
        default:
          return total;
      }
    }, 0);

    const newTaskMinutes =
      newTaskPriority === "long" ? 180 : newTaskPriority === "medium" ? 60 : 20;

    return totalMinutes + newTaskMinutes;
  }

  async function handleEditTask(taskData) {
    setIsSaving(true);
    setError(null);
    try {
      const targetTasks =
        taskData.dueOption === "today"
          ? tasksForToday
          : taskData.dueOption === "tomorrow"
          ? tasksForTomorrow
          : [];

      if (["today", "tomorrow"].includes(taskData.dueOption)) {
        const taskCounts = getTaskCounts(targetTasks);
        const totalMinutes = calculateTotalTime(targetTasks, taskData.priority);

        let warningMessage = null;

        // Prüfe Zeitlimit
        if (totalMinutes > 360) {
          warningMessage = `This would result in ${Math.floor(
            totalMinutes / 60
          )}h ${totalMinutes % 60}min of tasks for ${
            taskData.dueOption
          }. That's more than the recommended 6 hours.`;
        } else if (
          (taskData.priority === "long" && taskCounts.long >= 1) ||
          (taskData.priority === "medium" && taskCounts.medium >= 2) ||
          (taskData.priority === "short" && taskCounts.short >= 3)
        ) {
          warningMessage = `You already have the maximum number of ${taskData.priority} tasks scheduled for ${taskData.dueOption}.`;
        }

        if (warningMessage) {
          const confirmed = await showWarning(
            "Task Limit Warning",
            `${warningMessage}\n\nContinue anyway?`
          );

          if (!confirmed) {
            setIsSaving(false);
            return;
          }
        }
      }

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
