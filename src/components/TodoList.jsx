import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DraggableTodoItem } from './DraggableTodoItem'
import { TodoItem } from './TodoItem'

/**
 * List component that renders a collection of todo items with drag-and-drop reordering
 * @param {Object} props
 * @param {Array} props.todos - Array of todo objects
 * @param {Function} props.onToggle - Callback when a todo's checkbox is toggled
 * @param {Function} props.onDelete - Callback when a todo's delete button is clicked
 * @param {Function} props.onEdit - Callback when a todo's edit button is clicked
 * @param {Function} props.onToggleSubtask - Callback when subtask checkbox is toggled
 * @param {Function} props.onDeleteSubtask - Callback when subtask delete is clicked
 * @param {Function} props.onAddSubtask - Callback when new subtask is added
 * @param {string|null} props.selectedTodoId - ID of currently selected todo
 * @param {Function} props.onSelect - Callback when todo is selected
 * @param {string|null} props.editingId - ID of todo currently being edited
 * @param {Function} props.onSave - Callback when edit form is saved
 * @param {Function} props.onCancelEdit - Callback when edit is cancelled
 * @param {React.Component} props.EditTodoForm - Edit form component to render when editing
 * @param {boolean} props.enableDragDrop - Whether drag and drop is enabled (default: true)
 */
export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onToggleSubtask,
  onDeleteSubtask,
  onAddSubtask,
  selectedTodoId,
  onSelect,
  editingId,
  onSave,
  onCancelEdit,
  EditTodoForm,
  enableDragDrop = true,
}) {
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

  // Get sorted item IDs for SortableContext
  const todoIds = todos.map((todo) => todo.id)

  const renderTodoItem = (todo) => {
    // If editing this todo, render edit form
    if (editingId === todo.id && EditTodoForm) {
      return (
        <EditTodoForm
          todo={todo}
          onSave={onSave}
          onCancel={onCancelEdit}
        />
      )
    }

    // If drag and drop is enabled, use DraggableTodoItem
    if (enableDragDrop) {
      return (
        <DraggableTodoItem
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
          onAddSubtask={onAddSubtask}
          isSelected={selectedTodoId === todo.id}
          onSelect={onSelect}
        />
      )
    }

    // Fallback to regular TodoItem
    return (
      <TodoItem
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onToggleSubtask={onToggleSubtask}
        onDeleteSubtask={onDeleteSubtask}
        onAddSubtask={onAddSubtask}
        isSelected={selectedTodoId === todo.id}
        onSelect={onSelect}
      />
    )
  }

  return (
    <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
      <ul className="space-y-2 sm:space-y-3" role="list" aria-label="Todo list">
        {todos.map((todo) => (
          <li key={todo.id}>
            {renderTodoItem(todo)}
          </li>
        ))}
      </ul>
    </SortableContext>
  )
}
