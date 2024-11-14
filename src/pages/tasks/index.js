import TaskList from "@/src/components/taskList/TaskList";
import { useTasks } from "@/src/hooks/useTasks";
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

export default function AllTasksInDetailPage() {
  const { task, tasks, toggleTaskCompletion, editTask, deleteTask } =
    useTasks();
  return (
    <>
      <p>Test: pages/tasks/index</p>
      <TaskList
        title="All tasks"
        tasks={tasks}
        onToggle={toggleTaskCompletion}
        // onEdit={editTask}
        onDelete={deleteTask}
      />
    </>
  );
}
