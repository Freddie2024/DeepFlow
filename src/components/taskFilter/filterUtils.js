export const DURATION_FILTERS = {
  ALL: "all",
  LONG: "long",
  MEDIUM: "medium",
  SHORT: "short",
};

export function filterTasksByDuration(tasks, durationFilter) {
  if (durationFilter === DURATION_FILTERS.ALL) return tasks;
  return tasks.filter((task) => task.priority === durationFilter);
}
