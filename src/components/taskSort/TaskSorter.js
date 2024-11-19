import { SORT_OPTIONS } from "./sortUtils";

export default function TaskSorter({ onSortChange, currentSort }) {
  return (
    <div className="sort-controls">
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value={SORT_OPTIONS.DEFAULT}>Default (Creation Date)</option>
        <option value={SORT_OPTIONS.DATE_ASC}>Date (Earliest First)</option>
        <option value={SORT_OPTIONS.DATE_DESC}>Date (Latest First)</option>
      </select>
    </div>
  );
}
