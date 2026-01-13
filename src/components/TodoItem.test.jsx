import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from './TodoItem'

describe('TodoItem', () => {
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

  describe('rendering', () => {
    it('renders the todo title', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByText('Test todo')).toBeInTheDocument()
    })

    it('renders completion and selection checkboxes', () => {
      render(<TodoItem {...defaultProps} />)

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(2)
    })

    it('renders edit button', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    })

    it('renders delete button', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('completion checkbox is unchecked when todo is not completed', () => {
      render(<TodoItem {...defaultProps} />)

      const completionCheckbox = screen.getByLabelText(/mark "test todo" as complete/i)
      expect(completionCheckbox).not.toBeChecked()
    })

    it('completion checkbox is checked when todo is completed', () => {
      const completedTodo = { ...baseTodo, completed: true }
      render(<TodoItem {...defaultProps} todo={completedTodo} />)

      const completionCheckbox = screen.getByLabelText(/mark "test todo" as incomplete/i)
      expect(completionCheckbox).toBeChecked()
    })
  })

  describe('interactions', () => {
    it('calls onToggle with todo id when completion checkbox is clicked', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      render(<TodoItem {...defaultProps} onToggle={onToggle} />)

      const completionCheckbox = screen.getByLabelText(/mark "test todo" as complete/i)
      await user.click(completionCheckbox)

      expect(onToggle).toHaveBeenCalledTimes(1)
      expect(onToggle).toHaveBeenCalledWith('test-id-123')
    })

    it('calls onDelete with todo id when delete button is clicked', async () => {
      const user = userEvent.setup()
      const onDelete = vi.fn()
      render(<TodoItem {...defaultProps} onDelete={onDelete} />)

      await user.click(screen.getByRole('button', { name: /delete/i }))

      expect(onDelete).toHaveBeenCalledTimes(1)
      expect(onDelete).toHaveBeenCalledWith('test-id-123')
    })

    it('calls onEdit with todo id when edit button is clicked', async () => {
      const user = userEvent.setup()
      const onEdit = vi.fn()
      render(<TodoItem {...defaultProps} onEdit={onEdit} />)

      await user.click(screen.getByRole('button', { name: /edit/i }))

      expect(onEdit).toHaveBeenCalledTimes(1)
      expect(onEdit).toHaveBeenCalledWith('test-id-123')
    })
  })

  describe('completion styling', () => {
    it('applies strikethrough styling when todo is completed', () => {
      const completedTodo = { ...baseTodo, completed: true }
      render(<TodoItem {...defaultProps} todo={completedTodo} />)

      const title = screen.getByText('Test todo')
      expect(title).toHaveClass('line-through')
    })

    it('does not apply strikethrough when todo is not completed', () => {
      render(<TodoItem {...defaultProps} />)

      const title = screen.getByText('Test todo')
      expect(title).not.toHaveClass('line-through')
    })
  })

  describe('due date display', () => {
    it('does not show due date when not set', () => {
      render(<TodoItem {...defaultProps} />)

      // Should only have the title, no date text
      expect(screen.queryByText(/today/i)).not.toBeInTheDocument()
    })

    it('shows "Today" for todos due today', () => {
      const today = new Date()
      const todayTodo = { ...baseTodo, dueDate: today.toISOString() }
      render(<TodoItem {...defaultProps} todo={todayTodo} />)

      expect(screen.getByText('Today')).toBeInTheDocument()
    })

    it('shows formatted date for future due dates', () => {
      // Use a date in the future
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7) // 7 days from now
      const futureTodo = { ...baseTodo, dueDate: futureDate.toISOString() }
      render(<TodoItem {...defaultProps} todo={futureTodo} />)

      // Should show month and day (e.g., "Jan 20")
      const dateText = screen.getByText((content) => {
        // Check that it's a formatted date (contains a month abbreviation)
        return /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(content)
      })
      expect(dateText).toBeInTheDocument()
    })
  })

  describe('overdue styling', () => {
    let realDate

    beforeEach(() => {
      // Store the real Date constructor
      realDate = globalThis.Date
    })

    afterEach(() => {
      // Restore the real Date constructor
      globalThis.Date = realDate
    })

    it('applies overdue styling for past due dates on incomplete todos', () => {
      // Create a date that's definitely in the past
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 7) // 7 days ago
      const overdueTodo = { ...baseTodo, dueDate: pastDate.toISOString(), completed: false }

      const { container } = render(<TodoItem {...defaultProps} todo={overdueTodo} />)

      // Check for red border class on the main todo container (inside the wrapper)
      const todoContainer = container.firstChild.firstChild
      expect(todoContainer).toHaveClass('border-red-300')
      expect(todoContainer).toHaveClass('bg-red-50/90')
    })

    it('does not apply overdue styling for completed todos with past due dates', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 7) // 7 days ago
      const completedOverdueTodo = { ...baseTodo, dueDate: pastDate.toISOString(), completed: true }

      const { container } = render(<TodoItem {...defaultProps} todo={completedOverdueTodo} />)

      const todoContainer = container.firstChild.firstChild
      expect(todoContainer).not.toHaveClass('border-red-300')
      expect(todoContainer).not.toHaveClass('bg-red-50')
    })

    it('does not apply overdue styling for todos due today', () => {
      const today = new Date()
      const todayTodo = { ...baseTodo, dueDate: today.toISOString() }

      const { container } = render(<TodoItem {...defaultProps} todo={todayTodo} />)

      const todoContainer = container.firstChild.firstChild
      expect(todoContainer).not.toHaveClass('border-red-300')
    })

    it('does not apply overdue styling for future due dates', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7) // 7 days from now
      const futureTodo = { ...baseTodo, dueDate: futureDate.toISOString() }

      const { container } = render(<TodoItem {...defaultProps} todo={futureTodo} />)

      const todoContainer = container.firstChild.firstChild
      expect(todoContainer).not.toHaveClass('border-red-300')
    })
  })

  describe('priority badge display', () => {
    it('does not show priority badge when priority is null', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.queryByText('High')).not.toBeInTheDocument()
      expect(screen.queryByText('Medium')).not.toBeInTheDocument()
      expect(screen.queryByText('Low')).not.toBeInTheDocument()
    })

    it('shows high priority badge with rose styling', () => {
      const highPriorityTodo = { ...baseTodo, priority: 'high' }
      render(<TodoItem {...defaultProps} todo={highPriorityTodo} />)

      const badge = screen.getByText('High')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-rose-100')
      expect(badge).toHaveClass('text-rose-700')
    })

    it('shows medium priority badge with amber styling', () => {
      const mediumPriorityTodo = { ...baseTodo, priority: 'medium' }
      render(<TodoItem {...defaultProps} todo={mediumPriorityTodo} />)

      const badge = screen.getByText('Medium')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-amber-100')
      expect(badge).toHaveClass('text-amber-700')
    })

    it('shows low priority badge with emerald styling', () => {
      const lowPriorityTodo = { ...baseTodo, priority: 'low' }
      render(<TodoItem {...defaultProps} todo={lowPriorityTodo} />)

      const badge = screen.getByText('Low')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-emerald-100')
      expect(badge).toHaveClass('text-emerald-700')
    })
  })

  describe('accessibility', () => {
    it('has accessible checkbox label', () => {
      render(<TodoItem {...defaultProps} />)

      expect(
        screen.getByLabelText(/mark "test todo" as complete/i)
      ).toBeInTheDocument()
    })

    it('has accessible edit button label', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByLabelText(/edit "test todo"/i)).toBeInTheDocument()
    })

    it('has accessible delete button label', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.getByLabelText(/delete "test todo"/i)).toBeInTheDocument()
    })

    it('checkbox label indicates incomplete for completed todos', () => {
      const completedTodo = { ...baseTodo, completed: true }
      render(<TodoItem {...defaultProps} todo={completedTodo} />)

      expect(
        screen.getByLabelText(/mark "test todo" as incomplete/i)
      ).toBeInTheDocument()
    })
  })

  describe('tags display', () => {
    const createTags = (count) =>
      Array.from({ length: count }, (_, i) => ({
        id: `tag-${i + 1}`,
        name: `Tag ${i + 1}`,
        color: ['blue', 'red', 'green', 'yellow', 'purple'][i % 5],
      }))

    it('does not show tags section when there are no tags', () => {
      render(<TodoItem {...defaultProps} />)

      expect(screen.queryByLabelText('Tags')).not.toBeInTheDocument()
    })

    it('renders tags as colored pills below todo text', () => {
      const todoWithTags = {
        ...baseTodo,
        tags: createTags(2),
      }
      render(<TodoItem {...defaultProps} todo={todoWithTags} />)

      expect(screen.getByLabelText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Tag 1')).toBeInTheDocument()
      expect(screen.getByText('Tag 2')).toBeInTheDocument()
    })

    it('shows tag pills with matching background color styling', () => {
      const todoWithTags = {
        ...baseTodo,
        tags: [{ id: 'tag-1', name: 'Blue Tag', color: 'blue' }],
      }
      render(<TodoItem {...defaultProps} todo={todoWithTags} />)

      const tagPill = screen.getByText('Blue Tag')
      expect(tagPill).toHaveClass('bg-blue-100')
      expect(tagPill).toHaveClass('text-blue-700')
    })

    it('shows max 3 tags visible', () => {
      const todoWithTags = {
        ...baseTodo,
        tags: createTags(3),
      }
      render(<TodoItem {...defaultProps} todo={todoWithTags} />)

      expect(screen.getByText('Tag 1')).toBeInTheDocument()
      expect(screen.getByText('Tag 2')).toBeInTheDocument()
      expect(screen.getByText('Tag 3')).toBeInTheDocument()
      expect(screen.queryByText('+1')).not.toBeInTheDocument()
    })

    it('shows +N for overflow when more than 3 tags', () => {
      const todoWithTags = {
        ...baseTodo,
        tags: createTags(5),
      }
      render(<TodoItem {...defaultProps} todo={todoWithTags} />)

      expect(screen.getByText('Tag 1')).toBeInTheDocument()
      expect(screen.getByText('Tag 2')).toBeInTheDocument()
      expect(screen.getByText('Tag 3')).toBeInTheDocument()
      expect(screen.queryByText('Tag 4')).not.toBeInTheDocument()
      expect(screen.queryByText('Tag 5')).not.toBeInTheDocument()
      expect(screen.getByText('+2')).toBeInTheDocument()
    })

    it('overflow indicator has accessible label with remaining tag names', () => {
      const todoWithTags = {
        ...baseTodo,
        tags: createTags(5),
      }
      render(<TodoItem {...defaultProps} todo={todoWithTags} />)

      expect(
        screen.getByLabelText('2 more tags: Tag 4, Tag 5')
      ).toBeInTheDocument()
    })

    it('shows tooltip with remaining tags on overflow indicator', () => {
      const todoWithTags = {
        ...baseTodo,
        tags: createTags(4),
      }
      render(<TodoItem {...defaultProps} todo={todoWithTags} />)

      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toBeInTheDocument()
      expect(tooltip).toHaveTextContent('Tag 4')
    })
  })

  describe('subtask progress display', () => {
    const createSubtasks = (count, completedCount = 0) =>
      Array.from({ length: count }, (_, i) => ({
        id: `subtask-${i + 1}`,
        text: `Subtask ${i + 1}`,
        completed: i < completedCount,
      }))

    it('does not show progress indicator when there are no subtasks', () => {
      render(<TodoItem {...defaultProps} />)

      // Should not have any progress text
      expect(screen.queryByText(/\/\d+/)).not.toBeInTheDocument()
    })

    it('shows progress indicator in X/Y format when subtasks exist', () => {
      const todoWithSubtasks = {
        ...baseTodo,
        subtasks: createSubtasks(3, 1),
      }
      render(<TodoItem {...defaultProps} todo={todoWithSubtasks} />)

      expect(screen.getByText('1/3')).toBeInTheDocument()
    })

    it('shows progress bar visual when subtasks exist', () => {
      const todoWithSubtasks = {
        ...baseTodo,
        subtasks: createSubtasks(4, 2),
      }
      const { container } = render(<TodoItem {...defaultProps} todo={todoWithSubtasks} />)

      // Check for progress bar container
      const progressBar = container.querySelector('[style*="width"]')
      expect(progressBar).toBeInTheDocument()
      expect(progressBar).toHaveStyle({ width: '50%' })
    })

    it('clicking progress indicator expands subtask list', async () => {
      const user = userEvent.setup()
      const todoWithSubtasks = {
        ...baseTodo,
        subtasks: createSubtasks(2, 0),
      }
      render(<TodoItem {...defaultProps} todo={todoWithSubtasks} />)

      // Initially subtasks should not be visible
      expect(screen.queryByLabelText('Subtasks')).not.toBeInTheDocument()

      // Click the progress indicator
      const progressButton = screen.getByRole('button', { name: /subtasks completed/i })
      await user.click(progressButton)

      // Now subtasks should be visible
      expect(screen.getByLabelText('Subtasks')).toBeInTheDocument()
      expect(screen.getByText('Subtask 1')).toBeInTheDocument()
      expect(screen.getByText('Subtask 2')).toBeInTheDocument()
    })

    it('clicking progress indicator again collapses subtask list', async () => {
      const user = userEvent.setup()
      const todoWithSubtasks = {
        ...baseTodo,
        subtasks: createSubtasks(2, 0),
      }
      render(<TodoItem {...defaultProps} todo={todoWithSubtasks} />)

      const progressButton = screen.getByRole('button', { name: /subtasks completed/i })

      // Expand
      await user.click(progressButton)
      expect(screen.getByLabelText('Subtasks')).toBeInTheDocument()

      // Collapse
      await user.click(progressButton)
      expect(screen.queryByLabelText('Subtasks')).not.toBeInTheDocument()
    })

    it('progress indicator has proper aria attributes', () => {
      const todoWithSubtasks = {
        ...baseTodo,
        subtasks: createSubtasks(3, 2),
      }
      render(<TodoItem {...defaultProps} todo={todoWithSubtasks} />)

      const progressButton = screen.getByRole('button', { name: /2 of 3 subtasks completed/i })
      expect(progressButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('calls onToggleSubtask when subtask checkbox is clicked', async () => {
      const user = userEvent.setup()
      const onToggleSubtask = vi.fn()
      const todoWithSubtasks = {
        ...baseTodo,
        subtasks: createSubtasks(1, 0),
      }
      render(<TodoItem {...defaultProps} todo={todoWithSubtasks} onToggleSubtask={onToggleSubtask} />)

      // Expand subtasks first
      const progressButton = screen.getByRole('button', { name: /subtasks completed/i })
      await user.click(progressButton)

      // Click subtask checkbox
      const subtaskCheckbox = screen.getByLabelText(/Mark "Subtask 1"/i)
      await user.click(subtaskCheckbox)

      expect(onToggleSubtask).toHaveBeenCalledWith('test-id-123', 'subtask-1')
    })

    it('calls onDeleteSubtask when subtask delete is clicked', async () => {
      const user = userEvent.setup()
      const onDeleteSubtask = vi.fn()
      const todoWithSubtasks = {
        ...baseTodo,
        subtasks: createSubtasks(1, 0),
      }
      render(<TodoItem {...defaultProps} todo={todoWithSubtasks} onDeleteSubtask={onDeleteSubtask} />)

      // Expand subtasks first
      const progressButton = screen.getByRole('button', { name: /subtasks completed/i })
      await user.click(progressButton)

      // Click delete button
      const deleteButton = screen.getByLabelText(/Delete "Subtask 1"/i)
      await user.click(deleteButton)

      expect(onDeleteSubtask).toHaveBeenCalledWith('test-id-123', 'subtask-1')
    })

    it('calls onAddSubtask when new subtask is added', async () => {
      const user = userEvent.setup()
      const onAddSubtask = vi.fn()
      const todoWithSubtasks = {
        ...baseTodo,
        subtasks: createSubtasks(1, 0),
      }
      render(<TodoItem {...defaultProps} todo={todoWithSubtasks} onAddSubtask={onAddSubtask} />)

      // Expand subtasks first
      const progressButton = screen.getByRole('button', { name: /subtasks completed/i })
      await user.click(progressButton)

      // Add a new subtask
      const input = screen.getByLabelText('New subtask')
      await user.type(input, 'New subtask text')

      const addButton = screen.getByLabelText('Add subtask')
      await user.click(addButton)

      expect(onAddSubtask).toHaveBeenCalledWith('test-id-123', 'New subtask text')
    })
  })

  describe('selection checkbox', () => {
    it('renders selection checkbox on left side', () => {
      render(<TodoItem {...defaultProps} />)

      const selectionCheckbox = screen.getByLabelText(/select "test todo"/i)
      expect(selectionCheckbox).toBeInTheDocument()
      expect(selectionCheckbox).toHaveAttribute('type', 'checkbox')
    })

    it('selection checkbox is unchecked when todo is not selected', () => {
      render(<TodoItem {...defaultProps} isSelected={false} />)

      const selectionCheckbox = screen.getByLabelText(/select "test todo"/i)
      expect(selectionCheckbox).not.toBeChecked()
    })

    it('selection checkbox is checked when todo is selected', () => {
      render(<TodoItem {...defaultProps} isSelected={true} />)

      const selectionCheckbox = screen.getByLabelText(/select "test todo"/i)
      expect(selectionCheckbox).toBeChecked()
    })

    it('calls onSelect with todo id when selection checkbox is clicked', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      render(<TodoItem {...defaultProps} onSelect={onSelect} isSelected={false} />)

      const selectionCheckbox = screen.getByLabelText(/select "test todo"/i)
      await user.click(selectionCheckbox)

      expect(onSelect).toHaveBeenCalledTimes(1)
      expect(onSelect).toHaveBeenCalledWith('test-id-123')
    })

    it('applies highlight background when todo is selected', () => {
      const { container } = render(<TodoItem {...defaultProps} isSelected={true} />)

      const todoContainer = container.firstChild.firstChild
      expect(todoContainer).toHaveClass('bg-indigo-50/50')
      expect(todoContainer).toHaveClass('border-indigo-500')
      expect(todoContainer).toHaveClass('ring-2')
      expect(todoContainer).toHaveClass('ring-indigo-500/50')
    })

    it('does not apply highlight background when todo is not selected', () => {
      const { container } = render(<TodoItem {...defaultProps} isSelected={false} />)

      const todoContainer = container.firstChild.firstChild
      expect(todoContainer).not.toHaveClass('bg-indigo-50/50')
      expect(todoContainer).not.toHaveClass('border-indigo-500')
    })

    it('has separate selection and completion checkboxes', () => {
      render(<TodoItem {...defaultProps} />)

      const selectionCheckbox = screen.getByLabelText(/select "test todo"/i)
      const completionCheckbox = screen.getByLabelText(/mark "test todo" as complete/i)

      expect(selectionCheckbox).toBeInTheDocument()
      expect(completionCheckbox).toBeInTheDocument()
      expect(selectionCheckbox).not.toBe(completionCheckbox)
    })

    it('selection checkbox does not toggle completion', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      const onSelect = vi.fn()
      render(<TodoItem {...defaultProps} onToggle={onToggle} onSelect={onSelect} isSelected={false} />)

      const selectionCheckbox = screen.getByLabelText(/select "test todo"/i)
      await user.click(selectionCheckbox)

      expect(onSelect).toHaveBeenCalled()
      expect(onToggle).not.toHaveBeenCalled()
    })

    it('completion checkbox does not toggle selection', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      const onSelect = vi.fn()
      render(<TodoItem {...defaultProps} onToggle={onToggle} onSelect={onSelect} isSelected={false} />)

      const completionCheckbox = screen.getByLabelText(/mark "test todo" as complete/i)
      await user.click(completionCheckbox)

      expect(onToggle).toHaveBeenCalled()
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('does not throw when onSelect is not provided', () => {
      render(<TodoItem {...defaultProps} onSelect={undefined} isSelected={false} />)

      const selectionCheckbox = screen.getByLabelText(/select "test todo"/i)
      expect(() => selectionCheckbox.click()).not.toThrow()
    })
  })
})
