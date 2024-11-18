"use client";

import TaskForm from "../components/taskForm/TaskForm";
import { useRouter } from "next/router";
import { useTasks } from "../hooks/useTasks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function CreateTaskPage() {
  const router = useRouter();
  const { addNewTask, tasks } = useTasks();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  async function handleAddNewTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    data.userId = session?.user?.id;

    try {
      await addNewTask(data);

      let targetLocation = "today";
      if (data.dueOption === "later") targetLocation = "later date";
      if (data.dueOption === "someday") targetLocation = "someday";
      if (data.dueOption === "tomorrow") targetLocation = "tomorrow";

      toast.success(`Task successfully added to ${targetLocation}!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      router.back();
    } catch (error) {
      toast.error("Failed to add task. Please try again.");
    }
  }

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <h2 id="add-task">Add Task</h2>
      <TaskForm
        formName={"add-task"}
        onSubmit={handleAddNewTask}
        tasksForToday={tasks}
        tasksForTomorrow={tasks}
        currentTaskId={null}
        onCancel={() => router.back()}
      />
    </>
  );
}
