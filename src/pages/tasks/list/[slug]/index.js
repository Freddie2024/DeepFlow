import TaskList from "@/src/components/taskList/TaskList";
import { useRouter } from "next/router";
import { useTasks } from "@/src/hooks/useTasks";
import TaskForm from "@/src/components/taskForm/TaskForm";
import { useEffect, useState, useMemo, useRef } from "react";
import { getSession } from "next-auth/react";
import Button from "@/src/components/button/Button";
import Link from "next/link";
import TaskSummary from "@/src/components/taskSummary/taskSummary";
import TaskSorter from "@/src/components/taskSort/taskSorter";
import { SORT_OPTIONS, sortTasks } from "@/src/components/taskSort/sortUtils";
import TaskFilter from "@/src/components/taskFilter/TaskFilter";
import {
  DURATION_FILTERS,
  filterTasksByDuration,
} from "@/src/components/taskFilter/filterUtils";

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

export default function TasksByDate() {
  const {
    tasks,
    loading,
    toggleTaskCompletion,
    editTask,
    deleteTask,
    addNewTask,
  } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.DEFAULT);
  const [durationFilter, setDurationFilter] = useState(DURATION_FILTERS.ALL);

  const previousFilteredTasksRef = useRef(filteredTasks);
  const router = useRouter();
  const { slug } = router.query;

  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowDateString = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  const dueOptionMap = {
    today: "today",
    tomorrow: "tomorrow",
    later: "later",
    someday: "someday",
  };

  const defaultDueOption = dueOptionMap[slug] || "today";

  const formatDuration = (priority) => {
    switch (priority) {
      case "long":
        return "3 hours";
      case "medium":
        return "1 hour";
      case "short":
        return "20 minutes";
      default:
        return "unknown";
    }
  };

  useEffect(() => {
    const savedSort = localStorage.getItem("taskSortPreference");
    if (savedSort) {
      setSortOption(savedSort);
    }
  }, []);

  useEffect(() => {
    if (tasks) {
      try {
        const filtered = tasks
          .filter((task) => {
            const taskDueDate = task.dueDate
              ? new Date(task.dueDate).toISOString().split("T")[0]
              : null;

            if (slug === "today") {
              return taskDueDate === todayDate;
            } else if (slug === "tomorrow") {
              return taskDueDate === tomorrowDateString;
            } else if (slug === "someday") {
              return taskDueDate === null;
            } else if (slug === "later") {
              return taskDueDate && taskDueDate > tomorrowDateString;
            }
            return false;
          })
          .map((task) => ({
            ...task,
            duration: formatDuration(task.priority),
          }));
        if (
          JSON.stringify(previousFilteredTasksRef.current) !==
          JSON.stringify(filtered)
        ) {
          setFilteredTasks(filtered);
          previousFilteredTasksRef.current = filtered;
        }
      } catch (error) {
        console.error("Error filtering tasks:", error);
        setFilteredTasks([]);
      }
    }
  }, [tasks, slug, todayDate, tomorrowDateString]);

  const getTaskCounts = (tasks) => {
    if (!tasks) {
      return { long: 0, medium: 0, short: 0 };
    }
    return {
      long: tasks.filter((t) => t.priority === "long").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      short: tasks.filter((t) => t.priority === "short").length,
    };
  };

  const getTaskLimits = () => ({
    long: 1,
    medium: 2,
    short: 3,
  });

  const isTaskLimitReached = (priority, taskCounts) => {
    const limits = getTaskLimits();
    return taskCounts[priority] >= limits[priority];
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTask = Object.fromEntries(formData);

    if (["today", "tomorrow"].includes(slug)) {
      const currentTasks = filteredTasks;
      const taskCounts = getTaskCounts(currentTasks);

      if (isTaskLimitReached(newTask.priority, taskCounts)) {
        alert(
          `You've reached the limit for ${newTask.priority} tasks for ${slug}.`
        );
        return;
      }
    }

    const dueDate = getDueDateBySlug(slug);
    if (dueDate !== null || slug !== "later") {
      newTask.dueDate = dueDate;
    } else if (slug === "later" && !newTask.dueDate) {
      alert("Please select a specific future date in the form.");
      return;
    }
    await addNewTask(newTask);
  };

  const handleEditTask = async (updatedTask) => {
    await editTask(updatedTask);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleToggleTaskCompletion = async (taskId) => {
    await toggleTaskCompletion(taskId);
  };

  const getDueDateBySlug = (slug) => {
    if (slug === "today") return todayDate;
    if (slug === "tomorrow") return tomorrowDateString;
    if (slug === "someday") return null;
    return null;
  };

  const emptyMessage = {
    today:
      "Create 6 tasks you want to focus on today:\n1 long, 2 medium, 3 short ones with a total of 6 hours.",
    tomorrow:
      "Create 6 tasks you want to focus on tomorrow:\n1 long, 2 medium, 3 short ones with a total of 6 hours.",
    someday:
      "Set aside tasks you want to complete someday\nbut that are not urgent.",
    later:
      "No upcoming tasks scheduled.\nAdd tasks with specific future dates!",
  };

  if (loading) return <p>Loading todays tasks...</p>;

  const showTaskForm =
    ["today", "tomorrow"].includes(slug) && filteredTasks.length < 6;
  (slug === "someday" || slug === "later") && filteredTasks.length === 0;

  const taskCounts = getTaskCounts(filteredTasks);

  return (
    <>
      <div className="header-container">
        <h2>
          {filteredTasks.length > 0
            ? `Tasks for ${slug}`
            : `No tasks for ${slug} so far`}
        </h2>

        {slug === "later" && (
          <TaskSorter
            onSortChange={(option) => {
              setSortOption(option);
              localStorage.setItem("taskSortPreference", option);
            }}
            currentSort={sortOption}
          />
        )}
        {slug === "someday" && (
          <TaskFilter
            onFilterChange={setDurationFilter}
            currentFilter={durationFilter}
          />
        )}

        {(slug === "later" || slug === "someday") && (
          <Link href="/create" passHref>
            <Button as="a" variant="centered">
              + Add Task
            </Button>
          </Link>
        )}
      </div>

      {filteredTasks.length > 0 && (
        <>
          <TaskList
            tasks={
              slug === "later"
                ? sortTasks(filteredTasks, sortOption)
                : slug === "someday"
                ? filterTasksByDuration(filteredTasks, durationFilter)
                : filteredTasks
              // filteredTasks
            }
            onToggle={handleToggleTaskCompletion}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          {["today", "tomorrow"].includes(slug) && (
            <TaskSummary tasks={filteredTasks} dateType={slug} />
          )}
        </>
      )}

      {!filteredTasks.length ? (
        <>
          <p className="empty-message">
            {emptyMessage[slug] || "No tasks available."}
          </p>
        </>
      ) : null}

      {showTaskForm && (
        <TaskForm
          onSubmit={handleFormSubmit}
          defaultDueOption={defaultDueOption}
          disabledPriorities={
            ["today", "tomorrow"].includes(slug)
              ? Object.entries(taskCounts)
                  .filter(([priority, count]) =>
                    isTaskLimitReached(priority, taskCounts)
                  )
                  .map(([priority]) => priority)
              : []
          }
        />
      )}
    </>
  );
}
