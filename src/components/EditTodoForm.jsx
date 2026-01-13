import { useState, useEffect, useRef } from 'react'

/**
 * Convert ISO date string to YYYY-MM-DD format for date input
 * @param {string|null} isoString - ISO date string or null
 * @returns {string} Date in YYYY-MM-DD format or empty string
 */
function toDateInputValue(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toISOString().split('T')[0]
}

/**
 * Form component for editing existing todos
 * @param {Object} props
 * @param {Object} props.todo - The todo object being edited
 * @param {string} props.todo.id - Todo ID
 * @param {string} props.todo.title - Todo title
 * @param {boolean} props.todo.completed - Whether todo is completed
 * @param {string|null} props.todo.dueDate - Optional due date as ISO string
 * @param {'high'|'medium'|'low'|null} props.todo.priority - Optional priority level
 * @param {Function} props.onSave - Callback when save is clicked (id, updates)
 * @param {Function} props.onCancel - Callback when cancel is clicked
 */
export function EditTodoForm({ todo, onSave, onCancel }) {
  const [title, setTitle] = useState(todo.title)
  const [dueDate, setDueDate] = useState(toDateInputValue(todo.dueDate))
  const [priority, setPriority] = useState(todo.priority || '')
  const titleInputRef = useRef(null)

  // Focus the title input on mount
  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return
    }

    // Convert date input value to ISO string or null
    const dueDateValue = dueDate ? new Date(dueDate).toISOString() : null
    // Convert priority to null if empty string
    const priorityValue = priority || null

    onSave(todo.id, {
      title: trimmedTitle,
      dueDate: dueDateValue,
      priority: priorityValue,
    })
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-lg shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label htmlFor={`edit-title-${todo.id}`} className="sr-only">
            Task title
          </label>
          <input
            ref={titleInputRef}
            type="text"
            id={`edit-title-${todo.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="sm:w-40">
          <label htmlFor={`edit-due-date-${todo.id}`} className="sr-only">
            Due date
          </label>
          <input
            type="date"
            id={`edit-due-date-${todo.id}`}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="sm:w-32">
          <label htmlFor={`edit-priority-${todo.id}`} className="sr-only">
            Priority
          </label>
          <select
            id={`edit-priority-${todo.id}`}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="">None</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-3 py-1.5 text-sm bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 active:bg-blue-800 transition-all"
        >
          Save
        </button>
      </div>
    </form>
  )
}
