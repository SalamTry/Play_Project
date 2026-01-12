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
      <div className="text-center py-8 text-gray-500">
        <p>No todos yet. Add one above to get started!</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2" role="list" aria-label="Todo list">
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
