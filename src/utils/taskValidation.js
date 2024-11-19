import { showWarning } from "../lib/sweetAlertUtils";

/**
 * Task limits configuration
 */
export const TASK_LIMITS = {
  DAILY_TOTAL: 6,
  LONG: 1,
  MEDIUM: 2,
  SHORT: 3,
};

/**
 * Validates the total number of tasks for a given day
 */
export async function validateDailyTaskLimit(tasks, dayType) {
  if (tasks.length >= TASK_LIMITS.DAILY_TOTAL) {
    const confirmed = await showWarning(
      "Task Limit Warning",
      `You already have ${TASK_LIMITS.DAILY_TOTAL} tasks scheduled for ${dayType}.\n\n` +
        "Please check the tasks duration to ensure a balanced workload:\n" +
        "• Maximum 1 long task (3 hours)\n" +
        "• Maximum 2 medium tasks (1 hour each)\n" +
        "• Maximum 3 short tasks (20 minutes each)"
    );
    return confirmed;
  }
  return true;
}

/**
 * Validates task priority limits for a given day
 */
export async function validatePriorityLimit(priority, tasks) {
  const priorityCount = tasks.filter(
    (task) => task.priority === priority
  ).length;

  const warnings = {
    long: {
      limit: TASK_LIMITS.LONG,
      duration: "3 hours",
    },
    medium: {
      limit: TASK_LIMITS.MEDIUM,
      duration: "1 hour each",
    },
    short: {
      limit: TASK_LIMITS.SHORT,
      duration: "20 minutes each",
    },
  };

  if (priorityCount >= warnings[priority].limit) {
    const confirmed = await showWarning(
      `${priority.charAt(0).toUpperCase() + priority.slice(1)} Task Warning`,
      `You should only have ${warnings[priority].limit} ${priority} task${
        warnings[priority].limit > 1 ? "s" : ""
      } (${warnings[priority].duration}) per day. Continue anyway?`
    );
    return confirmed;
  }
  return true;
}

/**
 * Filters out the current task from a task list
 */
export function filterCurrentTask(tasks, currentTaskId) {
  return tasks.filter((task) => task._id !== currentTaskId);
}
