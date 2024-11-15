"use client";

import TaskList from "@/src/components/taskList/TaskList";
import { useTasks } from "@/src/hooks/useTasks";
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

export default function AllTasksInDetailPage() {
  const { tasks, toggleTaskCompletion, editTask, deleteTask } = useTasks();
  const { data: session } = useSession();

  async function handleToggleTaskCompletion(taskId) {
    if (!session) {
      console.error("User is not authenticated");
      return;
    }
    await toggleTaskCompletion(taskId);
  }

  async function handleDeleteTask(taskId) {
    if (!session) {
      console.error("User is not authenticated");
      return;
    }
    await deleteTask(taskId);
  }

  return (
    <>
      <TaskList
        title="All tasks"
        tasks={tasks}
        onToggle={handleToggleTaskCompletion}
        // onEdit={editTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
