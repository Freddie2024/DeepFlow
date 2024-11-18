import TaskForm from "../components/taskForm/TaskForm";
import { useTasks } from "../hooks/useTasks";
import TaskList from "../components/taskList/TaskList";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../components/button/Button";
import Link from "next/link";
import TaskSorter from "../components/taskSort/taskSorter";
import { SORT_OPTIONS, sortTasks } from "../components/taskSort/sortUtils";

export default function Home() {
  const { data: session, status } = useSession();

  const {
    tasks,
    addNewTask,
    deleteTask,
    toggleTaskCompletion,
    editTask,
    loading,
  } = useTasks();

  const [sortOption, setSortOption] = useState(SORT_OPTIONS.DEFAULT);

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
    const savedSort = localStorage.getItem("taskSortPreference");
    if (savedSort) {
      setSortOption(savedSort);
    }
  }, []);

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
        <TaskForm onSubmit={handleAddNewTask} formName={"add-task"} />
      </>
    );
  }

  return (
    <>
      <div className="header-container">
        <h2>All Tasks</h2>
        <TaskSorter
          onSortChange={(option) => {
            setSortOption(option);
            localStorage.setItem("taskSortPreference", option);
          }}
          currentSort={sortOption}
        />
        <Link href="/create" passHref>
          <Button as="a" variant="centered">
            + Add Task
          </Button>
        </Link>
      </div>

      <TaskList
        tasks={sortTasks(tasks, sortOption)}
        onDelete={deleteTask}
        onToggle={toggleTaskCompletion}
        showDueDate={true}
      />
    </>
  );
}
