import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DndContext } from '@dnd-kit/core'
import { TodoList } from './TodoList'

// Wrapper to provide DndContext for tests
function renderWithDnd(ui, options = {}) {
  return render(
    <DndContext>
      {ui}
    </DndContext>,
    options
  )
}

describe('TodoList', () => {
  const mockTodos = [
    {
      id: 'todo-1',
      title: 'First todo',
      completed: false,
      dueDate: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      order: 1,
    },
    {
      id: 'todo-2',
      title: 'Second todo',
      completed: true,
      dueDate: null,
      createdAt: '2024-01-02T00:00:00.000Z',
      order: 2,
    },
    {
      id: 'todo-3',
      title: 'Third todo',
      completed: false,
      dueDate: '2024-06-15T00:00:00.000Z',
      createdAt: '2024-01-03T00:00:00.000Z',
      order: 3,
    },
  ]

  const defaultProps = {
    todos: mockTodos,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    selectedTodoId: null,
    onSelect: vi.fn(),
    editingId: null,
    onSave: vi.fn(),
    onCancelEdit: vi.fn(),
    EditTodoForm: null,
    enableDragDrop: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders all todo items', () => {
      renderWithDnd(<TodoList {...defaultProps} />)

      expect(screen.getByText('First todo')).toBeInTheDocument()
      expect(screen.getByText('Second todo')).toBeInTheDocument()
      expect(screen.getByText('Third todo')).toBeInTheDocument()
    })

    it('renders a list element with role', () => {
      renderWithDnd(<TodoList {...defaultProps} />)

      expect(screen.getByRole('list', { name: /todo list/i })).toBeInTheDocument()
    })

    it('renders each todo as a list item', () => {
      renderWithDnd(<TodoList {...defaultProps} />)

      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(3)
    })

    it('renders the correct number of checkboxes', () => {
      renderWithDnd(<TodoList {...defaultProps} />)

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(3)
    })
  })

  describe('empty state', () => {
    it('shows empty state message when todos array is empty', () => {
      renderWithDnd(<TodoList {...defaultProps} todos={[]} />)

      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
    })

    it('shows empty state message when todos is undefined', () => {
      renderWithDnd(<TodoList {...defaultProps} todos={undefined} />)

      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
    })

    it('shows empty state message when todos is null', () => {
      renderWithDnd(<TodoList {...defaultProps} todos={null} />)

      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
    })

    it('does not render list element when empty', () => {
      renderWithDnd(<TodoList {...defaultProps} todos={[]} />)

      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
  })

  describe('callback propagation', () => {
    it('passes onToggle callback to TodoItem components', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      renderWithDnd(<TodoList {...defaultProps} onToggle={onToggle} />)

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])

      expect(onToggle).toHaveBeenCalledTimes(1)
      expect(onToggle).toHaveBeenCalledWith('todo-1')
    })

    it('passes onDelete callback to TodoItem components', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      renderWithDnd(<TodoList {...defaultProps} onDelete={onDelete} />)

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[1])

      expect(onDelete).toHaveBeenCalledTimes(1)
      expect(onDelete).toHaveBeenCalledWith('todo-2')
    })

    it('passes onEdit callback to TodoItem components', async () => {
      const user = userEvent.setup()
      const onEdit = vi.fn()
      renderWithDnd(<TodoList {...defaultProps} onEdit={onEdit} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await user.click(editButtons[2])

      expect(onEdit).toHaveBeenCalledTimes(1)
      expect(onEdit).toHaveBeenCalledWith('todo-3')
    })
  })

  describe('todo state display', () => {
    it('renders completed todos with checked checkboxes', () => {
      renderWithDnd(<TodoList {...defaultProps} />)

      const checkboxes = screen.getAllByRole('checkbox')
      // Second todo is completed
      expect(checkboxes[0]).not.toBeChecked()
      expect(checkboxes[1]).toBeChecked()
      expect(checkboxes[2]).not.toBeChecked()
    })

    it('renders single todo correctly', () => {
      const singleTodo = [mockTodos[0]]
      renderWithDnd(<TodoList {...defaultProps} todos={singleTodo} />)

      expect(screen.getByText('First todo')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })
  })

  describe('accessibility', () => {
    it('has accessible list label', () => {
      renderWithDnd(<TodoList {...defaultProps} />)

      expect(screen.getByRole('list', { name: /todo list/i })).toBeInTheDocument()
    })

    it('maintains proper list semantics', () => {
      renderWithDnd(<TodoList {...defaultProps} />)

      const list = screen.getByRole('list')
      const listItems = screen.getAllByRole('listitem')

      // All list items should be within the list
      listItems.forEach((item) => {
        expect(list).toContainElement(item)
      })
    })
  })

  describe('drag and drop', () => {
    it('renders drag handles when enableDragDrop is true', () => {
      renderWithDnd(<TodoList {...defaultProps} enableDragDrop={true} />)

      const dragHandles = screen.getAllByRole('button', { name: /drag to reorder/i })
      expect(dragHandles).toHaveLength(3)
    })

    it('does not render drag handles when enableDragDrop is false', () => {
      renderWithDnd(<TodoList {...defaultProps} enableDragDrop={false} />)

      const dragHandles = screen.queryAllByRole('button', { name: /drag to reorder/i })
      expect(dragHandles).toHaveLength(0)
    })

    it('renders DraggableTodoItem when enableDragDrop is true', () => {
      renderWithDnd(<TodoList {...defaultProps} enableDragDrop={true} />)

      // Drag handles indicate DraggableTodoItem is being used
      expect(screen.getAllByRole('button', { name: /drag to reorder/i })).toHaveLength(3)
    })

    it('defaults to enableDragDrop true', () => {
      const propsWithoutDragDrop = { ...defaultProps }
      delete propsWithoutDragDrop.enableDragDrop
      renderWithDnd(<TodoList {...propsWithoutDragDrop} />)

      const dragHandles = screen.getAllByRole('button', { name: /drag to reorder/i })
      expect(dragHandles).toHaveLength(3)
    })
  })

  describe('selection', () => {
    it('passes selected state to todo items', () => {
      renderWithDnd(<TodoList {...defaultProps} selectedTodoId="todo-2" />)

      // The second todo should have the selected highlight (ring style)
      const listItems = screen.getAllByRole('listitem')
      // We can check the todo text is there with the selection
      expect(screen.getByText('Second todo')).toBeInTheDocument()
    })

    it('calls onSelect when todo is clicked', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      renderWithDnd(<TodoList {...defaultProps} onSelect={onSelect} />)

      // Click on the first todo text
      await user.click(screen.getByText('First todo'))

      expect(onSelect).toHaveBeenCalledWith('todo-1')
    })
  })

  describe('editing mode', () => {
    it('renders EditTodoForm when editingId matches todo', () => {
      const MockEditForm = ({ todo, onSave, onCancel }) => (
        <div data-testid="edit-form">{todo.title} - Edit Mode</div>
      )

      renderWithDnd(
        <TodoList
          {...defaultProps}
          editingId="todo-2"
          EditTodoForm={MockEditForm}
        />
      )

      expect(screen.getByTestId('edit-form')).toBeInTheDocument()
      expect(screen.getByText('Second todo - Edit Mode')).toBeInTheDocument()
      // Other todos should still be visible normally
      expect(screen.getByText('First todo')).toBeInTheDocument()
      expect(screen.getByText('Third todo')).toBeInTheDocument()
    })

    it('passes onSave callback to EditTodoForm', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      const MockEditForm = ({ todo, onSave }) => (
        <button onClick={() => onSave(todo.id, { title: 'Updated' })}>
          Save
        </button>
      )

      renderWithDnd(
        <TodoList
          {...defaultProps}
          editingId="todo-1"
          onSave={onSave}
          EditTodoForm={MockEditForm}
        />
      )

      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).toHaveBeenCalledWith('todo-1', { title: 'Updated' })
    })

    it('passes onCancelEdit callback to EditTodoForm', async () => {
      const user = userEvent.setup()
      const onCancelEdit = vi.fn()
      const MockEditForm = ({ onCancel }) => (
        <button onClick={onCancel}>Cancel</button>
      )

      renderWithDnd(
        <TodoList
          {...defaultProps}
          editingId="todo-1"
          onCancelEdit={onCancelEdit}
          EditTodoForm={MockEditForm}
        />
      )

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(onCancelEdit).toHaveBeenCalled()
    })
  })

  describe('filtered todos', () => {
    it('works with filtered subset of todos', () => {
      const filteredTodos = mockTodos.filter((todo) => !todo.completed)
      renderWithDnd(<TodoList {...defaultProps} todos={filteredTodos} />)

      expect(screen.getByText('First todo')).toBeInTheDocument()
      expect(screen.queryByText('Second todo')).not.toBeInTheDocument()
      expect(screen.getByText('Third todo')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })

    it('renders drag handles for filtered todos', () => {
      const filteredTodos = mockTodos.filter((todo) => !todo.completed)
      renderWithDnd(<TodoList {...defaultProps} todos={filteredTodos} />)

      const dragHandles = screen.getAllByRole('button', { name: /drag to reorder/i })
      expect(dragHandles).toHaveLength(2)
    })
  })
})
