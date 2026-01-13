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
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg" role="tablist" aria-label="Filter todos by status">
        {statusFilters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            onClick={() => onFilterChange(value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 ${
              filter === value
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="priority-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Priority:
        </label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
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
