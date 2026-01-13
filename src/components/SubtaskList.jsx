import { useState } from 'react'

/**
 * Component for displaying and managing subtasks
 * @param {Object} props
 * @param {Array} props.subtasks - Array of subtask objects with id, text, completed
 * @param {Function} props.onToggle - Callback when subtask checkbox is toggled (subtaskId)
 * @param {Function} props.onDelete - Callback when subtask is deleted (subtaskId)
 * @param {Function} props.onAdd - Callback when new subtask is added (text)
 */
export function SubtaskList({ subtasks = [], onToggle, onDelete, onAdd }) {
  const [newSubtaskText, setNewSubtaskText] = useState('')

  function handleAddSubtask() {
    const trimmedText = newSubtaskText.trim()
    if (!trimmedText) return

    onAdd(trimmedText)
    setNewSubtaskText('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSubtask()
    }
  }

  return (
    <div className="space-y-2">
      {/* Subtask list */}
      {subtasks.length > 0 && (
        <ul className="space-y-1" aria-label="Subtasks">
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg group"
            >
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => onToggle(subtask.id)}
                aria-label={`Mark "${subtask.text}" as ${subtask.completed ? 'incomplete' : 'complete'}`}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-700 cursor-pointer shrink-0 dark:bg-slate-600 transition-all hover:scale-110 active:scale-95"
              />
              <span
                className={`flex-1 text-sm ${
                  subtask.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {subtask.text}
              </span>
              <button
                type="button"
                onClick={() => onDelete(subtask.id)}
                aria-label={`Delete "${subtask.text}"`}
                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-700 rounded transition-all hover:scale-110 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add subtask input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSubtaskText}
          onChange={(e) => setNewSubtaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add subtask"
          aria-label="New subtask"
          className="flex-1 px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all bg-white dark:bg-slate-700 dark:text-white"
        />
        <button
          type="button"
          onClick={handleAddSubtask}
          aria-label="Add subtask"
          className="px-3 py-1.5 text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 active:scale-95 transition-all"
        >
          Add
        </button>
      </div>
    </div>
  )
}
