import styles from "../../../../components/taskList/TaskList.module.css";
import TaskList from "@/src/components/taskList/TaskList";
import TaskForm from "@/src/components/taskForm/TaskForm";
import Button from "@/src/components/button/Button";
import Link from "next/link";
import TaskSummary from "@/src/components/taskSummary/taskSummary";
import TaskSorter from "@/src/components/taskSort/TaskSorter";
import { SORT_OPTIONS, sortTasks } from "@/src/components/taskSort/sortUtils";
import TaskFilter from "@/src/components/taskFilter/TaskFilter";
import {
  DURATION_FILTERS,
  filterTasksByDuration,
} from "@/src/components/taskFilter/filterUtils";
import { useRouter } from "next/router";
import { useTasks } from "@/src/hooks/useTasks";
import { useEffect, useState, useMemo, useRef } from "react";
import { getSession } from "next-auth/react";

/**
 * Server-side authentication check
 * Redirects to homepage if user is not authenticated
 */
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

/**
 * Main component for task management by date/category
 * Handles tasks for today, tomorrow, later and someday
 */
export default function TasksByDate() {
  // --- HOOKS AND STATE MANAGEMENT ---
  // Core task management hooks
  const {
    tasks,
    loading,
    toggleTaskCompletion,
    editTask,
    deleteTask,
    addNewTask,
  } = useTasks();
  // State for filtered, sorted, and filtered tasks
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.DEFAULT);
  const [durationFilter, setDurationFilter] = useState(DURATION_FILTERS.ALL);

  // Reference for preventing unnecessary re-renders
  const previousFilteredTasksRef = useRef(filteredTasks);
  const router = useRouter();
  const { slug } = router.query;

  // --- MEMOIZED DATE CALCULATIONS ---
  // Calculate today's and tomorrow's dates in ISO format
  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowDateString = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  // --- CONSTANTS AND MAPPINGS ---
  // Map route slugs to due date options
  const dueOptionMap = {
    today: "today",
    tomorrow: "tomorrow",
    later: "later",
    someday: "someday",
  };

  const defaultDueOption = dueOptionMap[slug] || "today";

  // --- UTILITY FUNCTIONS ---
  // Convert priority levels to human-readable durations
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

  // --- EFFECTS ---
  // Load saved sort preference from localStorage
  useEffect(() => {
    const savedSort = localStorage.getItem("taskSortPreference");
    if (savedSort) {
      setSortOption(savedSort);
    }
  }, []);

  // Filter tasks based on date and slug
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

  // --- TASK MANAGEMENT FUNCTIONS ---
  // Count tasks by priority
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

  // Define task limits per priority
  const getTaskLimits = () => ({
    long: 1,
    medium: 2,
    short: 3,
  });

  const isTaskLimitReached = (priority, taskCounts) => {
    const limits = getTaskLimits();
    return taskCounts[priority] >= limits[priority];
  };

  // --- EVENT HANDLERS ---
  // Handle new task submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTask = Object.fromEntries(formData);
    // Task limit validation for today and tomorrow
    if (["today", "tomorrow"].includes(slug)) {
      // Get current tasks for the selected day
      const currentTasks = filteredTasks;
      const taskCounts = getTaskCounts(currentTasks);

      if (isTaskLimitReached(newTask.priority, taskCounts)) {
        alert(
          `You've reached the limit for ${newTask.priority} tasks for ${slug}.`
        );
        return;
      }
    }
    // Set the due date based on the current page
    const dueDate = getDueDateBySlug(slug);
    // Handle due date assignment
    if (dueDate !== null || slug !== "later") {
      // For today, tomorrow, or someday tasks
      newTask.dueDate = dueDate;
    } else if (slug === "later" && !newTask.dueDate) {
      // For 'later' tasks, ensure a specific future date is selected
      alert("Please select a specific future date in the form.");
      return;
    }
    await addNewTask(newTask);
  };

  // Handle task operations (edit, delete, toggle)
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

  // --- RENDER HELPERS ---
  // Get empty state messages
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

  const completedMessage = {
    today:
      "Your today's tasks are complete!\nYou can mark them as done when finished.",
    tomorrow:
      "Your tomorrow's tasks are complete!\nYou can mark them as done when finished.",
  };

  const activeFilteredTasks = filteredTasks.filter((task) => !task.completed);
  const completedFilteredTasks = filteredTasks.filter((task) => task.completed);

  // Control task form visibility
  const showTaskForm =
    (["today", "tomorrow"].includes(slug) && filteredTasks.length < 6) ||
    ((slug === "someday" || slug === "later") && filteredTasks.length === 0);

  const taskCounts = getTaskCounts(filteredTasks);

  // --- RENDER LOGIC ---
  if (loading) return <p>Loading todays tasks...</p>;

  return (
    <>
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>
          {filteredTasks.length > 0
            ? `Tasks for ${slug}`
            : `No tasks for ${slug} so far`}
        </h2>

        <div className={styles.controls}>
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
      </div>

      {["today", "tomorrow"].includes(slug) ? (
        <>
          <TaskList
            tasks={filteredTasks}
            onToggle={handleToggleTaskCompletion}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          {filteredTasks.length > 0 && (
            <TaskSummary tasks={filteredTasks} dateType={slug} />
          )}
          {(filteredTasks.length === 0 || filteredTasks.length === 6) && (
            <p className="empty-message">
              {filteredTasks.length < 6
                ? emptyMessage[slug]
                : completedMessage[slug]}
            </p>
          )}
        </>
      ) : (
        <>
          {activeFilteredTasks.length > 0 && (
            <TaskList
              tasks={
                slug === "later"
                  ? sortTasks(activeFilteredTasks, sortOption)
                  : slug === "someday"
                  ? filterTasksByDuration(activeFilteredTasks, durationFilter)
                  : activeFilteredTasks
              }
              onToggle={handleToggleTaskCompletion}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}

          {completedFilteredTasks.length > 0 && (
            <>
              <h2 className={styles.completedTitle}>Completed Tasks</h2>
              <TaskList
                tasks={
                  slug === "later"
                    ? sortTasks(completedFilteredTasks, sortOption)
                    : filterTasksByDuration(
                        completedFilteredTasks,
                        durationFilter
                      )
                }
                onToggle={handleToggleTaskCompletion}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </>
          )}

          {!activeFilteredTasks.length && !completedFilteredTasks.length && (
            <p className="empty-message">
              {emptyMessage[slug] || "No tasks available."}
            </p>
          )}
        </>
      )}

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
