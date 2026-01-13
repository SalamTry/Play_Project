/**
 * Helper function to check if a date is today
 * @param {string} dateString - ISO date string
 * @returns {boolean}
 */
function isToday(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

/**
 * Helper function to check if a date is overdue (before today)
 * @param {string} dateString - ISO date string
 * @returns {boolean}
 */
function isOverdue(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  // Set time to start of day for comparison
  date.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * Format a due date for display
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
function formatDueDate(dateString) {
  if (isToday(dateString)) {
    return 'Today'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Get priority badge styling
 * @param {'high' | 'medium' | 'low' | null} priority
 * @returns {{ bg: string, text: string, label: string } | null}
 */
function getPriorityStyle(priority) {
  switch (priority) {
    case 'high':
      return { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-700 dark:text-rose-300', label: 'High' }
    case 'medium':
      return { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-700 dark:text-amber-300', label: 'Medium' }
    case 'low':
      return { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', label: 'Low' }
    default:
      return null
  }
}

/**
 * Individual todo item component
 * @param {Object} props
 * @param {Object} props.todo - The todo object
 * @param {string} props.todo.id - Todo ID
 * @param {string} props.todo.title - Todo title
 * @param {boolean} props.todo.completed - Whether todo is completed
 * @param {string|null} props.todo.dueDate - Optional due date as ISO string
 * @param {'high'|'medium'|'low'|null} props.todo.priority - Optional priority level
 * @param {Function} props.onToggle - Callback when checkbox is toggled
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {Function} props.onEdit - Callback when edit button is clicked
 */
export function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const { id, title, completed, dueDate, priority } = todo
  const priorityStyle = getPriorityStyle(priority)

  const showOverdueStyle = dueDate && isOverdue(dueDate) && !completed

  return (
    <div
      className={`flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        showOverdueStyle ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        aria-label={`Mark "${title}" as ${completed ? 'incomplete' : 'complete'}`}
        className="mt-0.5 sm:mt-0 h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 dark:focus:ring-offset-gray-800 cursor-pointer shrink-0 dark:bg-gray-700"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={`text-sm sm:text-base text-gray-900 dark:text-gray-100 break-words ${completed ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}
          >
            {title}
          </p>
          {priorityStyle && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}
            >
              {priorityStyle.label}
            </span>
          )}
        </div>
        {dueDate && (
          <p
            className={`text-xs sm:text-sm mt-0.5 ${
              showOverdueStyle
                ? 'text-red-600 dark:text-red-400 font-medium'
                : isToday(dueDate)
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {formatDueDate(dueDate)}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(id)}
          aria-label={`Edit "${title}"`}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 rounded transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(id)}
          aria-label={`Delete "${title}"`}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
