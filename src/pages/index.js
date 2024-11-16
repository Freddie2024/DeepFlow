import TaskForm from "../components/taskForm/TaskForm";
import { useTasks } from "../hooks/useTasks";
import TaskList from "../components/taskList/TaskList";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  console.log("Session on HomePage:", session);

  const {
    tasks,
    addNewTask,
    deleteTask,
    toggleTaskCompletion,
    editTask,
    loading,
  } = useTasks();
  const router = useRouter();

  async function handleAddNewTask(event) {
    event.preventDefault();
    if (!session) {
      console.error("User is not authenticated");
      return;
    }
    const formData = new FormData(event.target);
    const newTask = Object.fromEntries(formData);

    newTask.userId = session.user.userId;
    await addNewTask(newTask);
  }

  useEffect(() => {
    if (session === "authenticated") {
      router.push("/tasks/list/today");
    }
  }, [session, router]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session) {
    return (
      <div>
        <h2>Welcome to DeepFlow</h2>
        <p>Please create an account or log in to see your tasks.</p>
        <button onClick={() => signIn("google")}>Log in with Google</button>
        <p>or</p>
        <button onClick={() => signIn()}>
          Create account or log in with email
        </button>
      </div>
    );
  }

  if (status === "authenticated" && loading) {
    return <p>Loading all tasks...</p>;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <>
        <h2>No tasks so far</h2>
        <p>Create your first task!</p>
        <TaskForm
          onSubmit={handleAddNewTask}
          // defaultDueOption="today"
          formName={"add-task"}
        />
      </>
    );
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
