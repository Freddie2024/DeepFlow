import TaskForm from "../components/taskForm/TaskForm";
import { useTasks } from "../hooks/useTasks";
import TaskList from "../components/taskList/TaskList";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../components/button/Button";
import Link from "next/link";
import TaskSorter from "../components/taskSort/TaskSorter";
import { SORT_OPTIONS, sortTasks } from "../components/taskSort/sortUtils";
import styles from "./index.module.css";

export default function Home() {
  const { data: session, status } = useSession();

  const { tasks, addNewTask, deleteTask, toggleTaskCompletion, loading } =
    useTasks();

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
    if (status === "authenticated") {
      const hasSeenAbout = localStorage.getItem("hasSeenAbout");
      const isHomeClick = localStorage.getItem("clickedHome");

      if (!hasSeenAbout) {
        router.push("/about");
      } else if (isHomeClick) {
        setTimeout(() => {
          localStorage.removeItem("clickedHome");
        }, 1000);
      } else if (window.location.pathname === "/") {
        router.push("/tasks/list/today");
        router.push("/tasks/list/today");
      }
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (loading) return <p>Loading tasks...</p>;

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

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
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>All Tasks</h2>
        <div className={styles.controls}>
          <TaskSorter
            onSortChange={(option) => {
              setSortOption(option);
              localStorage.setItem("taskSortPreference", option);
            }}
            currentSort={sortOption}
          />

          <Link href="/create" legacyBehavior passHref>
            <Button as="a" variant="centered">
              + Add Task
            </Button>
          </Link>
        </div>
      </div>

      {activeTasks.length > 0 && (
        <TaskList
          tasks={sortTasks(activeTasks, sortOption)}
          onDelete={deleteTask}
          onToggle={toggleTaskCompletion}
          showDueDate={true}
        />
      )}

      {completedTasks.length > 0 && (
        <>
          <h2 className={styles.completedTitle}>Completed Tasks</h2>
          <TaskList
            tasks={sortTasks(completedTasks, sortOption)}
            onDelete={deleteTask}
            onToggle={toggleTaskCompletion}
            showDueDate={true}
          />
        </>
      )}
      {!activeTasks.length && !completedTasks.length && (
        <p className="empty-message">No tasks available.</p>
      )}
    </>
  );
}
