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
 * @param {Function} props.onSave - Callback when save is clicked (id, updates)
 * @param {Function} props.onCancel - Callback when cancel is clicked
 */
export function EditTodoForm({ todo, onSave, onCancel }) {
  const [title, setTitle] = useState(todo.title)
  const [dueDate, setDueDate] = useState(toDateInputValue(todo.dueDate))
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

    onSave(todo.id, {
      title: trimmedTitle,
      dueDate: dueDateValue,
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
      className="flex flex-col gap-3 p-3 bg-white border border-blue-300 rounded-lg shadow-sm"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  )
}
