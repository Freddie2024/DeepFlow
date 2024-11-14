"use client";

import { useRouter } from "next/router";
import { useTasks } from "@/src/hooks/useTasks";
import TaskDetails from "@/src/components/taskDetails/TaskDetails";
import { getSession } from "next-auth/react";

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

  const task = tasks?.find((task) => task._id === id);

  if (!tasks) return <p>Loading tasks...</p>;
  if (!task) return <p>Sorry, task not found.</p>;

  const handleDelete = (taskId) => {
    deleteTask(taskId);
    router.back();
  };

  return (
    <TaskDetails
      task={task}
      onToggle={toggleTaskCompletion}
      // onEdit={editTask}
      onDelete={handleDelete}
    />
  );
}
