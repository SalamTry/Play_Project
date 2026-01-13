/**
 * FilterBar component for filtering todos by status and priority
 * @param {Object} props
 * @param {'all' | 'active' | 'completed'} props.filter - Current status filter
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @param {'all' | 'high' | 'medium' | 'low'} props.priorityFilter - Current priority filter
 * @param {Function} props.onPriorityFilterChange - Callback when priority filter changes
 */
export function FilterBar({
  filter,
  onFilterChange,
  priorityFilter = 'all',
  onPriorityFilterChange,
}) {
  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg" role="tablist" aria-label="Filter todos by status">
        {statusFilters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            onClick={() => onFilterChange(value)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800 hover:scale-105 active:scale-95 ${
              filter === value
                ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="priority-filter" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Priority:
        </label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all bg-white dark:bg-slate-700 dark:text-white"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  )
}
