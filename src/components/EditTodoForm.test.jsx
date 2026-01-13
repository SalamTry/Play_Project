import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditTodoForm } from './EditTodoForm'

const mockTodo = {
  id: 'test-id-1',
  title: 'Test todo',
  completed: false,
  dueDate: '2024-12-31T00:00:00.000Z',
  priority: 'high',
}

const mockTodoWithoutDate = {
  id: 'test-id-2',
  title: 'Test todo no date',
  completed: false,
  dueDate: null,
  priority: null,
}

const mockTodoMediumPriority = {
  id: 'test-id-3',
  title: 'Test todo medium',
  completed: false,
  dueDate: null,
  priority: 'medium',
}

const mockTodoWithSubtasks = {
  id: 'test-id-4',
  title: 'Test todo with subtasks',
  completed: false,
  dueDate: null,
  priority: null,
  subtasks: [
    { id: 'st-1', text: 'Subtask 1', completed: false },
    { id: 'st-2', text: 'Subtask 2', completed: true },
  ],
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

    it('renders with the priority pre-filled when present', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      const prioritySelect = screen.getByLabelText(/priority/i)
      expect(prioritySelect).toHaveValue('high')
    })

    it('renders with empty priority when todo has no priority', () => {
      render(<EditTodoForm todo={mockTodoWithoutDate} onSave={() => {}} onCancel={() => {}} />)

      const prioritySelect = screen.getByLabelText(/priority/i)
      expect(prioritySelect).toHaveValue('')
    })

    it('renders priority dropdown with all options', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      const prioritySelect = screen.getByLabelText(/priority/i)
      expect(prioritySelect).toBeInTheDocument()

      const options = prioritySelect.querySelectorAll('option')
      expect(options).toHaveLength(4)
      expect(options[0]).toHaveValue('')
      expect(options[0]).toHaveTextContent('None')
      expect(options[1]).toHaveValue('high')
      expect(options[2]).toHaveValue('medium')
      expect(options[3]).toHaveValue('low')
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

    it('calls onSave with updated priority', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={onSave} onCancel={() => {}} />)

      await user.selectOptions(screen.getByLabelText(/priority/i), 'medium')
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave.mock.calls[0][1].priority).toBe('medium')
    })

    it('calls onSave with null priority when priority is cleared', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodo} onSave={onSave} onCancel={() => {}} />)

      await user.selectOptions(screen.getByLabelText(/priority/i), '')
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave.mock.calls[0][1].priority).toBeNull()
    })

    it('calls onSave with existing priority when unchanged', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodoMediumPriority} onSave={onSave} onCancel={() => {}} />)

      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave.mock.calls[0][1].priority).toBe('medium')
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
      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    })

    it('uses unique IDs based on todo ID', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      const titleInput = screen.getByLabelText(/task title/i)
      const dateInput = screen.getByLabelText(/due date/i)
      const prioritySelect = screen.getByLabelText(/priority/i)

      expect(titleInput.id).toContain('test-id-1')
      expect(dateInput.id).toContain('test-id-1')
      expect(prioritySelect.id).toContain('test-id-1')
    })
  })

  describe('subtasks functionality', () => {
    it('renders SubtaskList component', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      expect(screen.getByText('Subtasks')).toBeInTheDocument()
      expect(screen.getByLabelText(/new subtask/i)).toBeInTheDocument()
    })

    it('renders existing subtasks from todo', () => {
      render(<EditTodoForm todo={mockTodoWithSubtasks} onSave={() => {}} onCancel={() => {}} />)

      expect(screen.getByText('Subtask 1')).toBeInTheDocument()
      expect(screen.getByText('Subtask 2')).toBeInTheDocument()
    })

    it('can add a new subtask while editing', async () => {
      const user = userEvent.setup()
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      const subtaskInput = screen.getByLabelText(/new subtask/i)
      await user.type(subtaskInput, 'New subtask')
      await user.click(screen.getByRole('button', { name: /add subtask/i }))

      expect(screen.getByText('New subtask')).toBeInTheDocument()
    })

    it('can toggle subtask completion while editing', async () => {
      const user = userEvent.setup()
      render(<EditTodoForm todo={mockTodoWithSubtasks} onSave={() => {}} onCancel={() => {}} />)

      const checkbox = screen.getByLabelText(/mark "Subtask 1" as complete/i)
      expect(checkbox).not.toBeChecked()

      await user.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it('can delete a subtask while editing', async () => {
      const user = userEvent.setup()
      render(<EditTodoForm todo={mockTodoWithSubtasks} onSave={() => {}} onCancel={() => {}} />)

      expect(screen.getByText('Subtask 1')).toBeInTheDocument()

      const deleteButton = screen.getByLabelText(/delete "Subtask 1"/i)
      await user.click(deleteButton)

      expect(screen.queryByText('Subtask 1')).not.toBeInTheDocument()
    })

    it('saves subtasks with form submission', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodoWithSubtasks} onSave={onSave} onCancel={() => {}} />)

      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave.mock.calls[0][1].subtasks).toHaveLength(2)
      expect(onSave.mock.calls[0][1].subtasks[0].text).toBe('Subtask 1')
      expect(onSave.mock.calls[0][1].subtasks[1].text).toBe('Subtask 2')
    })

    it('saves modified subtasks after adding a new one', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodoWithSubtasks} onSave={onSave} onCancel={() => {}} />)

      // Add a new subtask
      const subtaskInput = screen.getByLabelText(/new subtask/i)
      await user.type(subtaskInput, 'New subtask')
      await user.click(screen.getByRole('button', { name: /add subtask/i }))

      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave.mock.calls[0][1].subtasks).toHaveLength(3)
      expect(onSave.mock.calls[0][1].subtasks[2].text).toBe('New subtask')
      expect(onSave.mock.calls[0][1].subtasks[2].completed).toBe(false)
    })

    it('saves modified subtasks after toggling completion', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodoWithSubtasks} onSave={onSave} onCancel={() => {}} />)

      // Toggle the first subtask
      const checkbox = screen.getByLabelText(/mark "Subtask 1" as complete/i)
      await user.click(checkbox)

      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave.mock.calls[0][1].subtasks[0].completed).toBe(true)
    })

    it('saves modified subtasks after deleting one', async () => {
      const user = userEvent.setup()
      const onSave = vi.fn()
      render(<EditTodoForm todo={mockTodoWithSubtasks} onSave={onSave} onCancel={() => {}} />)

      // Delete the first subtask
      const deleteButton = screen.getByLabelText(/delete "Subtask 1"/i)
      await user.click(deleteButton)

      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(onSave.mock.calls[0][1].subtasks).toHaveLength(1)
      expect(onSave.mock.calls[0][1].subtasks[0].text).toBe('Subtask 2')
    })

    it('handles todo without subtasks array', () => {
      render(<EditTodoForm todo={mockTodo} onSave={() => {}} onCancel={() => {}} />)

      // Should render SubtaskList with empty array (no subtasks shown but add input visible)
      expect(screen.getByText('Subtasks')).toBeInTheDocument()
      expect(screen.queryByRole('list', { name: /subtasks/i })).not.toBeInTheDocument()
    })
  })
})
