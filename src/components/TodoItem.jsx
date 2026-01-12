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
 * Individual todo item component
 * @param {Object} props
 * @param {Object} props.todo - The todo object
 * @param {string} props.todo.id - Todo ID
 * @param {string} props.todo.title - Todo title
 * @param {boolean} props.todo.completed - Whether todo is completed
 * @param {string|null} props.todo.dueDate - Optional due date as ISO string
 * @param {Function} props.onToggle - Callback when checkbox is toggled
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {Function} props.onEdit - Callback when edit button is clicked
 */
export function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const { id, title, completed, dueDate } = todo

  const showOverdueStyle = dueDate && isOverdue(dueDate) && !completed

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm ${
        showOverdueStyle ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        aria-label={`Mark "${title}" as ${completed ? 'incomplete' : 'complete'}`}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />

      <div className="flex-1 min-w-0">
        <p
          className={`text-gray-900 ${completed ? 'line-through text-gray-500' : ''}`}
        >
          {title}
        </p>
        {dueDate && (
          <p
            className={`text-sm ${
              showOverdueStyle
                ? 'text-red-600 font-medium'
                : isToday(dueDate)
                ? 'text-blue-600 font-medium'
                : 'text-gray-500'
            }`}
          >
            {formatDueDate(dueDate)}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(id)}
          aria-label={`Edit "${title}"`}
          className="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(id)}
          aria-label={`Delete "${title}"`}
          className="px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
