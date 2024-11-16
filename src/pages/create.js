"use client";

import TaskForm from "../components/taskForm/TaskForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTasks } from "../hooks/useTasks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function CreateTaskPage() {
  const router = useRouter();
  const { addNewTask } = useTasks();
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

    await addNewTask(data);
    router.push("/");
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
      <Link href="/">back</Link>
      <TaskForm onSubmit={handleAddNewTask} formName={"add-task"} />
    </>
  );
}
