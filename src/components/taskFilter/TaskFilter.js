import { DURATION_FILTERS } from "./filterUtils";
import styles from "../styles/shared/Dropdown.module.css";

export default function TaskFilter({ onFilterChange, currentFilter }) {
  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        aria-label="Filter tasks by duration"
      >
        <option value={DURATION_FILTERS.ALL}>All tasks</option>
        <option value={DURATION_FILTERS.LONG}>Long</option>
        <option value={DURATION_FILTERS.MEDIUM}>Medium</option>
        <option value={DURATION_FILTERS.SHORT}>Short</option>
      </select>
    </div>
  );
}
