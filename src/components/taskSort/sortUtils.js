export const SORT_OPTIONS = {
  DATE_ASC: "date-asc",
  DATE_DESC: "date-desc",
  DEFAULT: "default",
};

export function sortTasks(tasks, sortOption) {
  if (!tasks) return [];

  const incompleteTasks = tasks.filter((task) => !task.completed);

  return [...incompleteTasks].sort((a, b) => {
    switch (sortOption) {
      case SORT_OPTIONS.DATE_ASC:
        return new Date(a.dueDate) - new Date(b.dueDate);
      case SORT_OPTIONS.DATE_DESC:
        return new Date(b.dueDate) - new Date(a.dueDate);
      default:
        return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });
}
