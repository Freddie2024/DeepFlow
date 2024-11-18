function calculateTotalTime(tasks) {
  const totalMinutes = tasks.reduce((total, task) => {
    switch (task.priority) {
      case "long":
        return total + 180;
      case "medium":
        return total + 60;
      case "short":
        return total + 20;
      default:
        return total;
    }
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    text: `${hours}h ${minutes > 0 ? `${minutes}min` : ""}`,
    totalMinutes,
  };
}

function getTaskCounts(tasks) {
  return {
    long: tasks.filter((t) => t.priority === "long").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    short: tasks.filter((t) => t.priority === "short").length,
  };
}

function getTaskLimits() {
  return {
    long: 1,
    medium: 2,
    short: 3,
  };
}

function getMissingTasksMessage(taskCounts, dateType) {
  const limits = getTaskLimits();
  const missing = [];

  if (taskCounts.long < limits.long) {
    missing.push(`${limits.long - taskCounts.long} long task`);
  }
  if (taskCounts.medium < limits.medium) {
    missing.push(`${limits.medium - taskCounts.medium} medium tasks`);
  }
  if (taskCounts.short < limits.short) {
    missing.push(`${limits.short - taskCounts.short} short tasks`);
  }

  return missing.length
    ? `To complete your daily plan, add:\n${missing.join(", ")}`
    : `Great! You have all your tasks planned for ${dateType}!`;
}

export default function TaskSummary({ tasks, dateType }) {
  const { text: totalTime, totalMinutes } = calculateTotalTime(tasks);
  const taskCounts = getTaskCounts(tasks);
  const isOverWorkload = totalMinutes > 360;

  return (
    <div className="task-status">
      <p>
        You have planned {totalTime} for {dateType}.
      </p>
      {!isOverWorkload ? (
        <p>{getMissingTasksMessage(taskCounts, dateType)}</p>
      ) : (
        <>
          <p className="hint">
            Consider moving a task to another day to maintain a better balance.
          </p>
        </>
      )}
    </div>
  );
}
