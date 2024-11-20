export const SORT_OPTIONS = {
  DATE_ASC: "date-asc",
  DATE_DESC: "date-desc",
  DEFAULT: "default",
};

export function sortTasks(tasks, sortOption) {
  if (!tasks) return [];

  return [...tasks].sort((a, b) => {
    const isSomeday = (task) => !task.dueDate;

    if (isSomeday(a) && !isSomeday(b)) return 1;
    if (!isSomeday(a) && isSomeday(b)) return -1;

    switch (sortOption) {
      case SORT_OPTIONS.DATE_ASC:
        if (isSomeday(a) && isSomeday(b)) return 0;

        return new Date(a.dueDate) - new Date(b.dueDate);
      case SORT_OPTIONS.DATE_DESC:
        if (isSomeday(a) && isSomeday(b)) return 0;

        return new Date(b.dueDate) - new Date(a.dueDate);
      default:
        return 0;
    }
  });
}
