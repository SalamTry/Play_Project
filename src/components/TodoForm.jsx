import { useState } from 'react'

/**
 * Form component for adding new todos
 * @param {Object} props
 * @param {Function} props.onAddTodo - Callback when a todo is added (title, dueDate, priority)
 */
export function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('')

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

    onAddTodo(trimmedTitle, dueDateValue, priorityValue)

    // Reset form
    setTitle('')
    setDueDate('')
    setPriority('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="todo-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Task
        </label>
        <input
          type="text"
          id="todo-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="sm:w-40">
        <label htmlFor="todo-due-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Due date
        </label>
        <input
          type="date"
          id="todo-due-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="sm:w-32">
        <label htmlFor="todo-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Priority
        </label>
        <select
          id="todo-priority"
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

      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 active:bg-blue-800 transition-all"
      >
        Add
      </button>
    </form>
  )
}
