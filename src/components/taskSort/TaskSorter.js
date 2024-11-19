import { SORT_OPTIONS } from "./sortUtils";
import styles from "../styles/shared/Dropdown.module.css";

export default function TaskSorter({ onSortChange, currentSort }) {
  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value={SORT_OPTIONS.DEFAULT}>Created</option>
        <option value={SORT_OPTIONS.DATE_ASC}>↑ Date</option>
        <option value={SORT_OPTIONS.DATE_DESC}>↓ Date</option>
      </select>
    </div>
  );
}
