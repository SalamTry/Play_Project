import { getTagColorStyle } from './TagInput'

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
 * @param {Array} props.todo.tags - Optional array of tags
 * @param {Function} props.onToggle - Callback when checkbox is toggled
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {Function} props.onEdit - Callback when edit button is clicked
 */
export function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const { id, title, completed, dueDate, priority, tags = [] } = todo
  const priorityStyle = getPriorityStyle(priority)

  // Split tags into visible and overflow
  const MAX_VISIBLE_TAGS = 3
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS)
  const overflowTags = tags.slice(MAX_VISIBLE_TAGS)
  const overflowCount = overflowTags.length

  const showOverdueStyle = dueDate && isOverdue(dueDate) && !completed

  return (
    <div
      className={`flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-white/90 dark:bg-slate-800/90 border rounded-xl shadow-sm hover:shadow-md transition-all ${
        showOverdueStyle ? 'border-red-300 dark:border-red-700 bg-red-50/90 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        aria-label={`Mark "${title}" as ${completed ? 'incomplete' : 'complete'}`}
        className="mt-0.5 sm:mt-0 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 cursor-pointer shrink-0 dark:bg-slate-700 transition-all hover:scale-110 active:scale-95"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={`text-sm sm:text-base text-slate-900 dark:text-slate-100 break-words ${completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}
          >
            {title}
          </p>
          {priorityStyle && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyle.bg} ${priorityStyle.text}`}
            >
              {priorityStyle.label}
            </span>
          )}
        </div>
        {dueDate && (
          <p
            className={`text-xs sm:text-sm mt-0.5 ${
              showOverdueStyle
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : isToday(dueDate)
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {formatDueDate(dueDate)}
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5" aria-label="Tags">
            {visibleTags.map((tag) => {
              const colorStyle = getTagColorStyle(tag.color)
              return (
                <span
                  key={tag.id}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorStyle.bg} ${colorStyle.text}`}
                >
                  {tag.name}
                </span>
              )
            })}
            {overflowCount > 0 && (
              <span
                className="relative inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-default group"
                aria-label={`${overflowCount} more tags: ${overflowTags.map((t) => t.name).join(', ')}`}
              >
                +{overflowCount}
                <span
                  role="tooltip"
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded shadow-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10"
                >
                  {overflowTags.map((t) => t.name).join(', ')}
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(id)}
          aria-label={`Edit "${title}"`}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(id)}
          aria-label={`Delete "${title}"`}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
