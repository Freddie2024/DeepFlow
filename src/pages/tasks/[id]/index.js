"use client";

import { useRouter } from "next/router";
import { useTasks } from "@/src/hooks/useTasks";
import TaskDetails from "@/src/components/taskDetails/TaskDetails";
import { useSession, getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function TaskDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { tasks, toggleTaskCompletion, editTask, deleteTask } = useTasks();
  const { data: session } = useSession();

  const task = tasks?.find((task) => task._id === id);

  if (!tasks) return <p>Loading task details...</p>;
  if (!task) return <p>Sorry, task not found.</p>;

  const handleDelete = async (taskId) => {
    if (!session) {
      console.error("User is not authenticated");
      return;
    }
    await deleteTask(taskId);
    router.back();
  };

  const handleToggle = async (taskId) => {
    if (!session) {
      console.error("User is not authenticated");
      return;
    }
    await toggleTaskCompletion(taskId);
  };

  return (
    <TaskDetails
      task={task}
      onToggle={handleToggle}
      // onEdit={editTask}
      onDelete={handleDelete}
    />
  );
}
