import { DURATION_FILTERS } from "./filterUtils";
import styles from "./TaskFilter.module.css";

export default function TaskFilter({ onFilterChange, currentFilter }) {
  return (
    <div className={styles.filterContainer}>
      <select
        className={styles.filterSelect}
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        aria-label="Filter tasks by duration"
      >
        <option value={DURATION_FILTERS.ALL}>All Durations</option>
        <option value={DURATION_FILTERS.LONG}>Long (3h)</option>
        <option value={DURATION_FILTERS.MEDIUM}>Medium (1h)</option>
        <option value={DURATION_FILTERS.SHORT}>Short (20min)</option>
      </select>
    </div>
  );
}
