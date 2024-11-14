import TaskForm from "../components/taskForm/TaskForm";
import { useTasks } from "../hooks/useTasks";
import TaskList from "../components/taskList/TaskList";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const { tasks, addNewTask, deleteTask, toggleTaskCompletion, editTask } =
    useTasks();
  const router = useRouter();

  async function handleAddNewTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTask = Object.fromEntries(formData);
    await addNewTask(newTask);
  }

  useEffect(() => {
    if (session) {
      router.push("/tasks/list/today");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div>
        <h2>Welcome to DeepFlow</h2>
        <p>Please create an account or log in to see your tasks.</p>
        <button onClick={() => signIn("google")}>Login with Google</button>
        <p>or</p>
        <button onClick={() => signIn()}>
          Create account / Login with email
        </button>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <>
        <h2>No tasks so far</h2>
        <p>Create your first task!</p>
        <TaskForm onSubmit={handleAddNewTask} />
      </>
    );
  }

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <>
      <TaskList
        title="All Tasks"
        tasks={tasks}
        onDelete={deleteTask}
        onToggle={toggleTaskCompletion}
        // onEdit={editTask}
        showDueDate={true}
      />
    </>
  );
}
