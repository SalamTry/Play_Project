import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditTodoForm } from './EditTodoForm'

const mockTodo = {
  id: 'test-id-1',
  title: 'Test todo',
  completed: false,
  dueDate: '2024-12-31T00:00:00.000Z',
}

const mockTodoWithoutDate = {
  id: 'test-id-2',
  title: 'Test todo no date',
  completed: false,
  dueDate: null,
}

describe('EditTodoForm', () => {
  describe('rendering', () => {
    it('renders with the todo title pre-filled', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument()
    })

    it('renders with the due date pre-filled when present', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument()
    })

    it('renders with empty due date when todo has no due date', () => {
      render(<EditTodoForm todo={mockTodoWithoutDate} onSave={() => {}} onCancel={() => {}} />)

      const dateInput = screen.getByLabelText(/due date/i)
      expect(dateInput).toHaveValue('')
    })

    it('renders save and cancel buttons', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('focuses the title input on mount', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      const titleInput = screen.getByDisplayValue('Test todo')
      expect(document.activeElement).toBe(titleInput)
    })
  })

  describe('save functionality', () => {
    it('calls onSave with id and updated values when save is clicked', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={onSave} onCancel={() => {}} />)

      const titleInput = screen.getByDisplayValue('Test todo')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated todo')
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave.mock.calls[0][0]).toBe('test-id-1')
      expect(onSave.mock.calls[0][1].title).toBe('Updated todo')
    })

    it('calls onSave with updated due date', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={onSave} onCancel={() => {}} />)

      fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '2025-01-15' } })
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave.mock.calls[0][1].dueDate).toMatch(/2025-01-15/)
    })

    it('calls onSave with null due date when date is cleared', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={onSave} onCancel={() => {}} />)

      fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '' } })
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave.mock.calls[0][1].dueDate).toBeNull()
    })

    it('saves when pressing Enter in title field', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={onSave} onCancel={() => {}} />)

      const titleInput = screen.getByDisplayValue('Test todo')
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated{enter}')

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave.mock.calls[0][1].title).toBe('Updated')
    })

    it('trims whitespace from title before saving', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={onSave} onCancel={() => {}} />)

      const titleInput = screen.getByDisplayValue('Test todo')
      await user.clear(titleInput)
      await user.type(titleInput, '  Trimmed  ')
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave.mock.calls[0][1].title).toBe('Trimmed')
    })
  })

  describe('cancel functionality', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      const onCancel = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={onCancel} />)

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('calls onCancel when Escape key is pressed', async () => {
      const user = userEvent.setup()
      const onCancel = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={onCancel} />)

      await user.keyboard('{Escape}')

      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('calls onCancel when Escape is pressed in date field', async () => {
      const user = userEvent.setup()
      const onCancel = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={onCancel} />)

      const dateInput = screen.getByLabelText(/due date/i)
      dateInput.focus()
      await user.keyboard('{Escape}')

      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('validation', () => {
    it('does not call onSave when title is empty', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={onSave} onCancel={() => {}} />)

      const titleInput = screen.getByDisplayValue('Test todo')
      await user.clear(titleInput)
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).not.toHaveBeenCalled()
    })

    it('does not call onSave when title is only whitespace', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={onSave} onCancel={() => {}} />)

      const titleInput = screen.getByDisplayValue('Test todo')
      await user.clear(titleInput)
      await user.type(titleInput, '   ')
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has labels for inputs', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      // Screen reader only labels should exist
      expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
    })

    it('uses unique IDs based on todo ID', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      const titleInput = screen.getByLabelText(/task title/i)
      const dateInput = screen.getByLabelText(/due date/i)

      expect(titleInput.id).toContain('test-id-1')
      expect(dateInput.id).toContain('test-id-1')
    })
  })
})
