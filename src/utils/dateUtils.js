/**
 * Converts a Date object to a local ISO string date format (YYYY-MM-DD)
 * Handles timezone offsets to ensure correct local date
 */
export function getLocalISOString(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    console.error("Invalid date passed to getLocalISOString:", date);
    return null;
  }
  const offset = date.getTimezoneOffset() * 60000;
  const localISOString = new Date(date.getTime() - offset)
    .toISOString()
    .split("T")[0];

  return localISOString;
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayDate() {
  return getLocalISOString(new Date());
}

/**
 * Gets tomorrow's date in YYYY-MM-DD format
 */
export function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getLocalISOString(tomorrow);
}

/**
 * Determines the due option based on a date
 */
export function determineDueOption(dueDate) {
  if (dueDate === null || dueDate === undefined) return "someday";

  const formattedDueDate = getLocalISOString(new Date(dueDate));
  const today = getTodayDate();
  const tomorrow = getTomorrowDate();

  if (formattedDueDate === today) return "today";
  if (formattedDueDate === tomorrow) return "tomorrow";

  return "later";
}
