import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoForm } from './TodoForm'

describe('TodoForm', () => {
  describe('rendering', () => {
    it('renders a text input for todo title', () => {
      render(<TodoForm onAddTodo={() => {}} />)

      expect(screen.getByLabelText(/task/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument()
    })

    it('renders a date input for due date', () => {
      render(<TodoForm onAddTodo={() => {}} />)

      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
    })

    it('renders an add button', () => {
      render(<TodoForm onAddTodo={() => {}} />)

      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('calls onAddTodo with title and null due date when no date is set', async () => {
      const user = userEvent.setup()
      const onAddTodo = vi.fn()
      render(<TodoForm onAddTodo={onAddTodo} />)

      await user.type(screen.getByLabelText(/task/i), 'New todo')
      await user.click(screen.getByRole('button', { name: /add/i }))

      expect(onAddTodo).toHaveBeenCalledWith('New todo', null)
    })

    it('calls onAddTodo with title and ISO date string when date is set', async () => {
      const user = userEvent.setup()
      const onAddTodo = vi.fn()
      render(<TodoForm onAddTodo={onAddTodo} />)

      await user.type(screen.getByLabelText(/task/i), 'Todo with date')
      // Use fireEvent for date input as userEvent has issues with date inputs
      fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '2024-12-31' } })
      await user.click(screen.getByRole('button', { name: /add/i }))

      expect(onAddTodo).toHaveBeenCalledTimes(1)
      expect(onAddTodo.mock.calls[0][0]).toBe('Todo with date')
      // Verify the date is an ISO string
      expect(onAddTodo.mock.calls[0][1]).toMatch(/2024-12-31/)
    })

    it('clears the form after submission', async () => {
      const user = userEvent.setup()
      render(<TodoForm onAddTodo={() => {}} />)

      const titleInput = screen.getByLabelText(/task/i)
      const dateInput = screen.getByLabelText(/due date/i)

      await user.type(titleInput, 'New todo')
      fireEvent.change(dateInput, { target: { value: '2024-12-31' } })
      await user.click(screen.getByRole('button', { name: /add/i }))

      expect(titleInput).toHaveValue('')
      expect(dateInput).toHaveValue('')
    })

    it('can submit using Enter key', async () => {
      const user = userEvent.setup()
      const onAddTodo = vi.fn()
      render(<TodoForm onAddTodo={onAddTodo} />)

      const titleInput = screen.getByLabelText(/task/i)
      await user.type(titleInput, 'New todo{enter}')

      expect(onAddTodo).toHaveBeenCalledWith('New todo', null)
    })
  })

  describe('validation', () => {
    it('does not call onAddTodo when title is empty', async () => {
      const user = userEvent.setup()
      const onAddTodo = vi.fn()
      render(<TodoForm onAddTodo={onAddTodo} />)

      await user.click(screen.getByRole('button', { name: /add/i }))

      expect(onAddTodo).not.toHaveBeenCalled()
    })

    it('does not call onAddTodo when title is only whitespace', async () => {
      const user = userEvent.setup()
      const onAddTodo = vi.fn()
      render(<TodoForm onAddTodo={onAddTodo} />)

      await user.type(screen.getByLabelText(/task/i), '   ')
      await user.click(screen.getByRole('button', { name: /add/i }))

      expect(onAddTodo).not.toHaveBeenCalled()
    })

    it('trims whitespace from title before submission', async () => {
      const user = userEvent.setup()
      const onAddTodo = vi.fn()
      render(<TodoForm onAddTodo={onAddTodo} />)

      await user.type(screen.getByLabelText(/task/i), '  Trimmed title  ')
      await user.click(screen.getByRole('button', { name: /add/i }))

      expect(onAddTodo).toHaveBeenCalledWith('Trimmed title', null)
    })
  })

  describe('due date optional', () => {
    it('allows submission without a due date', async () => {
      const user = userEvent.setup()
      const onAddTodo = vi.fn()
      render(<TodoForm onAddTodo={onAddTodo} />)

      await user.type(screen.getByLabelText(/task/i), 'No due date todo')
      await user.click(screen.getByRole('button', { name: /add/i }))

      expect(onAddTodo).toHaveBeenCalledWith('No due date todo', null)
    })
  })
})
