import { useState, useEffect, useRef } from 'react'
import { SubtaskList } from './SubtaskList'

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
 * @param {Array} props.todo.subtasks - Array of subtask objects with id, text, completed
 * @param {Function} props.onSave - Callback when save is clicked (id, updates)
 * @param {Function} props.onCancel - Callback when cancel is clicked
 */
export function EditTodoForm({ todo, onSave, onCancel }) {
  const [title, setTitle] = useState(todo.title)
  const [dueDate, setDueDate] = useState(toDateInputValue(todo.dueDate))
  const [priority, setPriority] = useState(todo.priority || '')
  const [subtasks, setSubtasks] = useState(todo.subtasks || [])
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
      subtasks,
    })
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  function handleAddSubtask(text) {
    const newSubtask = {
      id: `subtask-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text,
      completed: false,
    }
    setSubtasks((prev) => [...prev, newSubtask])
  }

  function handleToggleSubtask(subtaskId) {
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    )
  }

  function handleDeleteSubtask(subtaskId) {
    setSubtasks((prev) => prev.filter((st) => st.id !== subtaskId))
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-3 p-3 sm:p-4 bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-600 rounded-xl shadow-lg shadow-indigo-500/10"
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
            className="w-full px-3 py-2 text-base border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all bg-white dark:bg-slate-700 dark:text-white"
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
            className="w-full px-3 py-2 text-base border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all bg-white dark:bg-slate-700 dark:text-white"
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
            className="w-full px-3 py-2 text-base border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all bg-white dark:bg-slate-700 dark:text-white"
          >
            <option value="">None</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Subtasks section */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Subtasks
        </label>
        <SubtaskList
          subtasks={subtasks}
          onToggle={handleToggleSubtask}
          onDelete={handleDeleteSubtask}
          onAdd={handleAddSubtask}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-3 py-1.5 text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 active:scale-95 transition-all"
        >
          Save
        </button>
      </div>
    </form>
  )
}
