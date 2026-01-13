import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TodoItem } from './TodoItem'

/**
 * Draggable wrapper for TodoItem using dnd-kit's useSortable hook
 * @param {Object} props
 * @param {Object} props.todo - The todo object
 * @param {Function} props.onToggle - Callback when checkbox is toggled
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {Function} props.onEdit - Callback when edit button is clicked
 * @param {Function} props.onToggleSubtask - Callback when subtask checkbox is toggled
 * @param {Function} props.onDeleteSubtask - Callback when subtask delete is clicked
 * @param {Function} props.onAddSubtask - Callback when new subtask is added
 * @param {boolean} props.isSelected - Whether this todo is selected
 * @param {Function} props.onSelect - Callback when todo is clicked for selection
 */
export function DraggableTodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onToggleSubtask,
  onDeleteSubtask,
  onAddSubtask,
  isSelected,
  onSelect,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      {/* Drag handle - inline on left side, visible on hover */}
      <div className="flex items-start gap-1">
        <button
          type="button"
          className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none shrink-0"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* TodoItem wrapper with flex-1 to fill remaining space */}
        <div className="flex-1 min-w-0">
          {/* Drop placeholder indicator */}
          <div
            className={`absolute inset-0 rounded-xl border-2 border-dashed border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 transition-opacity pointer-events-none ${
              isDragging ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />

          {/* TodoItem with drag styling */}
          <div
            className={`transition-all duration-200 ${
              isDragging ? 'opacity-50 scale-[1.02] shadow-xl' : ''
            }`}
          >
            <TodoItem
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onAddSubtask={onAddSubtask}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
