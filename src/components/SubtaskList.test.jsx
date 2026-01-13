import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubtaskList } from './SubtaskList'

describe('SubtaskList', () => {
  describe('rendering', () => {
    it('renders list of subtasks with checkboxes', () => {
      const subtasks = [
        { id: '1', text: 'Subtask 1', completed: false },
        { id: '2', text: 'Subtask 2', completed: true },
      ]
      render(<SubtaskList subtasks={subtasks} onToggle={() => {}} onDelete={() => {}} onAdd={() => {}} />)

      expect(screen.getByText('Subtask 1')).toBeInTheDocument()
      expect(screen.getByText('Subtask 2')).toBeInTheDocument()
      expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    })

    it('renders an input field to add new subtask', () => {
      render(<SubtaskList subtasks={[]} onToggle={() => {}} onDelete={() => {}} onAdd={() => {}} />)

      expect(screen.getByLabelText(/new subtask/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/add subtask/i)).toBeInTheDocument()
    })

    it('renders an Add button', () => {
      render(<SubtaskList subtasks={[]} onToggle={() => {}} onDelete={() => {}} onAdd={() => {}} />)

      expect(screen.getByRole('button', { name: /add subtask/i })).toBeInTheDocument()
    })

    it('renders delete buttons for each subtask', () => {
      const subtasks = [
        { id: '1', text: 'Subtask 1', completed: false },
        { id: '2', text: 'Subtask 2', completed: false },
      ]
      render(<SubtaskList subtasks={subtasks} onToggle={() => {}} onDelete={() => {}} onAdd={() => {}} />)

      expect(screen.getByLabelText(/delete "subtask 1"/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/delete "subtask 2"/i)).toBeInTheDocument()
    })

    it('does not render subtask list when no subtasks', () => {
      render(<SubtaskList subtasks={[]} onToggle={() => {}} onDelete={() => {}} onAdd={() => {}} />)

      expect(screen.queryByLabelText('Subtasks')).not.toBeInTheDocument()
    })
  })

  describe('checkbox toggling', () => {
    it('calls onToggle when checkbox is clicked', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      const subtasks = [{ id: '1', text: 'Subtask 1', completed: false }]
      render(<SubtaskList subtasks={subtasks} onToggle={onToggle} onDelete={() => {}} onAdd={() => {}} />)

      await user.click(screen.getByRole('checkbox'))

      expect(onToggle).toHaveBeenCalledTimes(1)
      expect(onToggle).toHaveBeenCalledWith('1')
    })

    it('reflects completed state in checkbox', () => {
      const subtasks = [
        { id: '1', text: 'Incomplete', completed: false },
        { id: '2', text: 'Completed', completed: true },
      ]
      render(<SubtaskList subtasks={subtasks} onToggle={() => {}} onDelete={() => {}} onAdd={() => {}} />)

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes[0]).not.toBeChecked()
      expect(checkboxes[1]).toBeChecked()
    })
  })

  describe('completed subtasks have strikethrough', () => {
    it('applies strikethrough style to completed subtasks', () => {
      const subtasks = [
        { id: '1', text: 'Incomplete', completed: false },
        { id: '2', text: 'Completed', completed: true },
      ]
      render(<SubtaskList subtasks={subtasks} onToggle={() => {}} onDelete={() => {}} onAdd={() => {}} />)

      const incompleteText = screen.getByText('Incomplete')
      const completedText = screen.getByText('Completed')

      expect(incompleteText).not.toHaveClass('line-through')
      expect(completedText).toHaveClass('line-through')
    })
  })

  describe('deleting subtasks', () => {
    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      const subtasks = [{ id: '1', text: 'Subtask 1', completed: false }]
      render(<SubtaskList subtasks={subtasks} onToggle={() => {}} onDelete={onDelete} onAdd={() => {}} />)

      await user.click(screen.getByLabelText(/delete "subtask 1"/i))

      expect(onDelete).toHaveBeenCalledTimes(1)
      expect(onDelete).toHaveBeenCalledWith('1')
    })

    it('can delete any subtask', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      const subtasks = [
        { id: '1', text: 'First', completed: false },
        { id: '2', text: 'Second', completed: false },
      ]
      render(<SubtaskList subtasks={subtasks} onToggle={() => {}} onDelete={onDelete} onAdd={() => {}} />)

      await user.click(screen.getByLabelText(/delete "second"/i))

      expect(onDelete).toHaveBeenCalledWith('2')
    })
  })

  describe('adding subtasks', () => {
    it('calls onAdd with text when Add button is clicked', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<SubtaskList subtasks={[]} onToggle={() => {}} onDelete={() => {}} onAdd={onAdd} />)

      await user.type(screen.getByLabelText(/new subtask/i), 'New subtask')
      await user.click(screen.getByRole('button', { name: /add subtask/i }))

      expect(onAdd).toHaveBeenCalledTimes(1)
      expect(onAdd).toHaveBeenCalledWith('New subtask')
    })

    it('clears input after adding a subtask', async () => {
      const user = userEvent.setup()
      render(<SubtaskList subtasks={[]} onToggle={() => {}} onDelete={() => {}} onAdd={() => {}} />)

      const input = screen.getByLabelText(/new subtask/i)
      await user.type(input, 'New subtask')
      await user.click(screen.getByRole('button', { name: /add subtask/i }))

      expect(input).toHaveValue('')
    })

    it('does not add subtask when text is empty', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<SubtaskList subtasks={[]} onToggle={() => {}} onDelete={() => {}} onAdd={onAdd} />)

      await user.click(screen.getByRole('button', { name: /add subtask/i }))

      expect(onAdd).not.toHaveBeenCalled()
    })

    it('does not add subtask when text is only whitespace', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<SubtaskList subtasks={[]} onToggle={() => {}} onDelete={() => {}} onAdd={onAdd} />)

      await user.type(screen.getByLabelText(/new subtask/i), '   ')
      await user.click(screen.getByRole('button', { name: /add subtask/i }))

      expect(onAdd).not.toHaveBeenCalled()
    })

    it('trims whitespace from subtask text', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<SubtaskList subtasks={[]} onToggle={() => {}} onDelete={() => {}} onAdd={onAdd} />)

      await user.type(screen.getByLabelText(/new subtask/i), '  New subtask  ')
      await user.click(screen.getByRole('button', { name: /add subtask/i }))

      expect(onAdd).toHaveBeenCalledWith('New subtask')
    })

    it('adds subtask on Enter key press', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<SubtaskList subtasks={[]} onToggle={() => {}} onDelete={() => {}} onAdd={onAdd} />)

      await user.type(screen.getByLabelText(/new subtask/i), 'New subtask{enter}')

      expect(onAdd).toHaveBeenCalledTimes(1)
      expect(onAdd).toHaveBeenCalledWith('New subtask')
    })
  })
})
