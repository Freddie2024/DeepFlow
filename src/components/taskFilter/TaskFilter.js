import { DURATION_FILTERS } from "./filterUtils";

export default function TaskFilter({ onFilterChange, currentFilter }) {
  return (
    <div className="filter-controls">
      <select
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value={DURATION_FILTERS.ALL}>All Durations</option>
        <option value={DURATION_FILTERS.LONG}>Long (3h)</option>
        <option value={DURATION_FILTERS.MEDIUM}>Medium (1h)</option>
        <option value={DURATION_FILTERS.SHORT}>Short (20min)</option>
      </select>
    </div>
  );
}
