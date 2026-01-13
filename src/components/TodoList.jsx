import { TodoItem } from './TodoItem'

/**
 * List component that renders a collection of todo items
 * @param {Object} props
 * @param {Array} props.todos - Array of todo objects
 * @param {Function} props.onToggle - Callback when a todo's checkbox is toggled
 * @param {Function} props.onDelete - Callback when a todo's delete button is clicked
 * @param {Function} props.onEdit - Callback when a todo's edit button is clicked
 */
export function TodoList({ todos, onToggle, onDelete, onEdit }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="text-gray-400 mb-3">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm sm:text-base">No todos yet. Add one above to get started!</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2 sm:space-y-3" role="list" aria-label="Todo list">
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </li>
      ))}
    </ul>
  )
}
