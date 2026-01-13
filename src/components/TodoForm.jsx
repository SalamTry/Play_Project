import { useState } from 'react'

/**
 * Form component for adding new todos
 * @param {Object} props
 * @param {Function} props.onAddTodo - Callback when a todo is added (title, dueDate)
 */
export function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return
    }

    // Convert date input value to ISO string or null
    const dueDateValue = dueDate ? new Date(dueDate).toISOString() : null

    onAddTodo(trimmedTitle, dueDateValue)

    // Reset form
    setTitle('')
    setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="todo-title" className="block text-sm font-medium text-gray-700 mb-1">
          Task
        </label>
        <input
          type="text"
          id="todo-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        />
      </div>

      <div className="sm:w-40">
        <label htmlFor="todo-due-date" className="block text-sm font-medium text-gray-700 mb-1">
          Due date
        </label>
        <input
          type="date"
          id="todo-due-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 transition-all"
      >
        Add
      </button>
    </form>
  )
}
