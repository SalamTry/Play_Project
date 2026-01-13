import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { DraggableTodoItem } from './DraggableTodoItem'

// Wrapper component to provide required dnd-kit context
function DndWrapper({ children, items = ['test-id-123'] }) {
  return (
    <DndContext>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

describe('DraggableTodoItem', () => {
  const baseTodo = {
    id: 'test-id-123',
    title: 'Test todo',
    completed: false,
    dueDate: null,
    createdAt: '2024-01-01T00:00:00.000Z',
  }

  const defaultProps = {
    todo: baseTodo,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useSortable hook integration', () => {
    it('renders TodoItem inside sortable wrapper', () => {
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      expect(screen.getByText('Test todo')).toBeInTheDocument()
    })

    it('applies sortable attributes to the container', () => {
      const { container } = render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      // The sortable container should have a ref and transform styles
      const sortableContainer = container.firstChild
      expect(sortableContainer).toBeInTheDocument()
      expect(sortableContainer).toHaveStyle({ transform: '' })
    })
  })

  describe('drag handle', () => {
    it('renders drag handle button', () => {
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      expect(screen.getByLabelText('Drag to reorder')).toBeInTheDocument()
    })

    it('drag handle has proper cursor styling class', () => {
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const dragHandle = screen.getByLabelText('Drag to reorder')
      expect(dragHandle).toHaveClass('cursor-grab')
    })

    it('drag handle is hidden by default and visible on group hover', () => {
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const dragHandle = screen.getByLabelText('Drag to reorder')
      // Initially has opacity-0 class (hidden), becomes visible on group-hover
      expect(dragHandle).toHaveClass('opacity-0')
      expect(dragHandle).toHaveClass('group-hover:opacity-100')
    })

    it('drag handle contains grip icon', () => {
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const dragHandle = screen.getByLabelText('Drag to reorder')
      const svg = dragHandle.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('transform and transition during drag', () => {
    it('container has relative positioning for transform origin', () => {
      const { container } = render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const sortableContainer = container.firstChild
      expect(sortableContainer).toHaveClass('relative')
    })

    it('inner wrapper has transition classes for smooth animations', () => {
      const { container } = render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      // The inner div wrapping TodoItem should have transition classes
      const innerWrapper = container.querySelector('.transition-all')
      expect(innerWrapper).toBeInTheDocument()
      expect(innerWrapper).toHaveClass('duration-200')
    })
  })

  describe('drop placeholder', () => {
    it('renders drop placeholder element', () => {
      const { container } = render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      // Find the placeholder by its dashed border class
      const placeholder = container.querySelector('.border-dashed')
      expect(placeholder).toBeInTheDocument()
    })

    it('placeholder has appropriate styling for visibility', () => {
      const { container } = render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const placeholder = container.querySelector('.border-dashed')
      expect(placeholder).toHaveClass('border-indigo-400')
      expect(placeholder).toHaveClass('rounded-xl')
      expect(placeholder).toHaveClass('absolute')
      expect(placeholder).toHaveClass('inset-0')
    })

    it('placeholder is hidden when not dragging', () => {
      const { container } = render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const placeholder = container.querySelector('.border-dashed')
      expect(placeholder).toHaveClass('opacity-0')
    })

    it('placeholder has aria-hidden for accessibility', () => {
      const { container } = render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const placeholder = container.querySelector('.border-dashed')
      expect(placeholder).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('TodoItem prop forwarding', () => {
    it('forwards onToggle callback to TodoItem', async () => {
      const onToggle = vi.fn()
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} onToggle={onToggle} />
        </DndWrapper>
      )

      const checkbox = screen.getByRole('checkbox')
      await checkbox.click()

      expect(onToggle).toHaveBeenCalledWith('test-id-123')
    })

    it('forwards onDelete callback to TodoItem', async () => {
      const onDelete = vi.fn()
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} onDelete={onDelete} />
        </DndWrapper>
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await deleteButton.click()

      expect(onDelete).toHaveBeenCalledWith('test-id-123')
    })

    it('forwards onEdit callback to TodoItem', async () => {
      const onEdit = vi.fn()
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} onEdit={onEdit} />
        </DndWrapper>
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await editButton.click()

      expect(onEdit).toHaveBeenCalledWith('test-id-123')
    })

    it('forwards isSelected prop to TodoItem', () => {
      const { container } = render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} isSelected={true} />
        </DndWrapper>
      )

      // TodoItem should have selected styling (indigo border)
      const todoContainer = container.querySelector('.border-indigo-500')
      expect(todoContainer).toBeInTheDocument()
    })

    it('forwards onSelect callback to TodoItem', async () => {
      const onSelect = vi.fn()
      const { container } = render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} onSelect={onSelect} />
        </DndWrapper>
      )

      // Click on the todo container (not on buttons)
      const todoText = screen.getByText('Test todo')
      await todoText.click()

      expect(onSelect).toHaveBeenCalledWith('test-id-123')
    })

    it('forwards subtask callbacks to TodoItem', () => {
      const todoWithSubtasks = {
        ...baseTodo,
        subtasks: [{ id: 'sub-1', text: 'Subtask 1', completed: false }],
      }
      const onToggleSubtask = vi.fn()
      const onDeleteSubtask = vi.fn()
      const onAddSubtask = vi.fn()

      render(
        <DndWrapper>
          <DraggableTodoItem
            {...defaultProps}
            todo={todoWithSubtasks}
            onToggleSubtask={onToggleSubtask}
            onDeleteSubtask={onDeleteSubtask}
            onAddSubtask={onAddSubtask}
          />
        </DndWrapper>
      )

      // Subtask progress should be visible
      expect(screen.getByText('0/1')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('drag handle has accessible label', () => {
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const dragHandle = screen.getByLabelText('Drag to reorder')
      expect(dragHandle).toBeInTheDocument()
    })

    it('drag handle is a button element for keyboard accessibility', () => {
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const dragHandle = screen.getByLabelText('Drag to reorder')
      expect(dragHandle.tagName).toBe('BUTTON')
    })

    it('drag handle has touch-none class for proper touch handling', () => {
      render(
        <DndWrapper>
          <DraggableTodoItem {...defaultProps} />
        </DndWrapper>
      )

      const dragHandle = screen.getByLabelText('Drag to reorder')
      expect(dragHandle).toHaveClass('touch-none')
    })
  })

  describe('multiple items sorting', () => {
    it('renders multiple draggable items in a list', () => {
      const todos = [
        { id: 'todo-1', title: 'First todo', completed: false },
        { id: 'todo-2', title: 'Second todo', completed: false },
        { id: 'todo-3', title: 'Third todo', completed: false },
      ]

      render(
        <DndWrapper items={todos.map((t) => t.id)}>
          {todos.map((todo) => (
            <DraggableTodoItem
              key={todo.id}
              {...defaultProps}
              todo={todo}
            />
          ))}
        </DndWrapper>
      )

      expect(screen.getByText('First todo')).toBeInTheDocument()
      expect(screen.getByText('Second todo')).toBeInTheDocument()
      expect(screen.getByText('Third todo')).toBeInTheDocument()
    })

    it('each item has its own drag handle', () => {
      const todos = [
        { id: 'todo-1', title: 'First todo', completed: false },
        { id: 'todo-2', title: 'Second todo', completed: false },
      ]

      render(
        <DndWrapper items={todos.map((t) => t.id)}>
          {todos.map((todo) => (
            <DraggableTodoItem
              key={todo.id}
              {...defaultProps}
              todo={todo}
            />
          ))}
        </DndWrapper>
      )

      const dragHandles = screen.getAllByLabelText('Drag to reorder')
      expect(dragHandles).toHaveLength(2)
    })
  })
})
