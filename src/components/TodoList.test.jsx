import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from './TodoList'

describe('TodoList', () => {
  const mockTodos = [
    {
      id: 'todo-1',
      title: 'First todo',
      completed: false,
      dueDate: null,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'todo-2',
      title: 'Second todo',
      completed: true,
      dueDate: null,
      createdAt: '2024-01-02T00:00:00.000Z',
    },
    {
      id: 'todo-3',
      title: 'Third todo',
      completed: false,
      dueDate: '2024-06-15T00:00:00.000Z',
      createdAt: '2024-01-03T00:00:00.000Z',
    },
  ]

  const defaultProps = {
    todos: mockTodos,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders all todo items', () => {
      render(<TodoList {...defaultProps} />)

      expect(screen.getByText('First todo')).toBeInTheDocument()
      expect(screen.getByText('Second todo')).toBeInTheDocument()
      expect(screen.getByText('Third todo')).toBeInTheDocument()
    })

    it('renders a list element with role', () => {
      render(<TodoList {...defaultProps} />)

      expect(screen.getByRole('list', { name: /todo list/i })).toBeInTheDocument()
    })

    it('renders each todo as a list item', () => {
      render(<TodoList {...defaultProps} />)

      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(3)
    })

    it('renders the correct number of checkboxes', () => {
      render(<TodoList {...defaultProps} />)

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(3)
    })
  })

  describe('empty state', () => {
    it('shows empty state message when todos array is empty', () => {
      render(<TodoList {...defaultProps} todos={[]} />)

      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
    })

    it('shows empty state message when todos is undefined', () => {
      render(<TodoList {...defaultProps} todos={undefined} />)

      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
    })

    it('shows empty state message when todos is null', () => {
      render(<TodoList {...defaultProps} todos={null} />)

      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
    })

    it('does not render list element when empty', () => {
      render(<TodoList {...defaultProps} todos={[]} />)

      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
  })

  describe('callback propagation', () => {
    it('passes onToggle callback to TodoItem components', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      render(<TodoList {...defaultProps} onToggle={onToggle} />)

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])

      expect(onToggle).toHaveBeenCalledTimes(1)
      expect(onToggle).toHaveBeenCalledWith('todo-1')
    })

    it('passes onDelete callback to TodoItem components', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      render(<TodoList {...defaultProps} onDelete={onDelete} />)

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[1])

      expect(onDelete).toHaveBeenCalledTimes(1)
      expect(onDelete).toHaveBeenCalledWith('todo-2')
    })

    it('passes onEdit callback to TodoItem components', async () => {
      const user = userEvent.setup()
      const onEdit = vi.fn()
      render(<TodoList {...defaultProps} onEdit={onEdit} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await user.click(editButtons[2])

      expect(onEdit).toHaveBeenCalledTimes(1)
      expect(onEdit).toHaveBeenCalledWith('todo-3')
    })
  })

  describe('todo state display', () => {
    it('renders completed todos with checked checkboxes', () => {
      render(<TodoList {...defaultProps} />)

      const checkboxes = screen.getAllByRole('checkbox')
      // Second todo is completed
      expect(checkboxes[0]).not.toBeChecked()
      expect(checkboxes[1]).toBeChecked()
      expect(checkboxes[2]).not.toBeChecked()
    })

    it('renders single todo correctly', () => {
      const singleTodo = [mockTodos[0]]
      render(<TodoList {...defaultProps} todos={singleTodo} />)

      expect(screen.getByText('First todo')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })
  })

  describe('accessibility', () => {
    it('has accessible list label', () => {
      render(<TodoList {...defaultProps} />)

      expect(screen.getByRole('list', { name: /todo list/i })).toBeInTheDocument()
    })

    it('maintains proper list semantics', () => {
      render(<TodoList {...defaultProps} />)

      const list = screen.getByRole('list')
      const listItems = screen.getAllByRole('listitem')

      // All list items should be within the list
      listItems.forEach((item) => {
        expect(list).toContainElement(item)
      })
    })
  })
})
