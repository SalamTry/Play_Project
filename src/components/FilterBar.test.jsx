import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from './FilterBar'

describe('FilterBar', () => {
  describe('rendering', () => {
    it('renders three status filter buttons', () => {
      render(
        <FilterBar
          filter="all"
          onFilterChange={() => {}}
          priorityFilter="all"
          onPriorityFilterChange={() => {}}
        />
      )

      expect(screen.getByRole('tab', { name: /all/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /active/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /completed/i })).toBeInTheDocument()
    })

    it('renders a priority filter dropdown', () => {
      render(
        <FilterBar
          filter="all"
          onFilterChange={() => {}}
          priorityFilter="all"
          onPriorityFilterChange={() => {}}
        />
      )

      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /high/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /medium/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /low/i })).toBeInTheDocument()
    })

    it('highlights the currently selected status filter', () => {
      render(
        <FilterBar
          filter="active"
          onFilterChange={() => {}}
          priorityFilter="all"
          onPriorityFilterChange={() => {}}
        />
      )

      expect(screen.getByRole('tab', { name: /active/i })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', { name: /all/i })).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByRole('tab', { name: /completed/i })).toHaveAttribute('aria-selected', 'false')
    })

    it('shows the currently selected priority filter', () => {
      render(
        <FilterBar
          filter="all"
          onFilterChange={() => {}}
          priorityFilter="high"
          onPriorityFilterChange={() => {}}
        />
      )

      expect(screen.getByLabelText(/priority/i)).toHaveValue('high')
    })
  })

  describe('status filter interactions', () => {
    it('calls onFilterChange when All button is clicked', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      render(
        <FilterBar
          filter="active"
          onFilterChange={onFilterChange}
          priorityFilter="all"
          onPriorityFilterChange={() => {}}
        />
      )

      await user.click(screen.getByRole('tab', { name: /^all$/i }))

      expect(onFilterChange).toHaveBeenCalledWith('all')
    })

    it('calls onFilterChange when Active button is clicked', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      render(
        <FilterBar
          filter="all"
          onFilterChange={onFilterChange}
          priorityFilter="all"
          onPriorityFilterChange={() => {}}
        />
      )

      await user.click(screen.getByRole('tab', { name: /active/i }))

      expect(onFilterChange).toHaveBeenCalledWith('active')
    })

    it('calls onFilterChange when Completed button is clicked', async () => {
      const user = userEvent.setup()
      const onFilterChange = vi.fn()
      render(
        <FilterBar
          filter="all"
          onFilterChange={onFilterChange}
          priorityFilter="all"
          onPriorityFilterChange={() => {}}
        />
      )

      await user.click(screen.getByRole('tab', { name: /completed/i }))

      expect(onFilterChange).toHaveBeenCalledWith('completed')
    })
  })

  describe('priority filter interactions', () => {
    it('calls onPriorityFilterChange when priority is selected', async () => {
      const user = userEvent.setup()
      const onPriorityFilterChange = vi.fn()
      render(
        <FilterBar
          filter="all"
          onFilterChange={() => {}}
          priorityFilter="all"
          onPriorityFilterChange={onPriorityFilterChange}
        />
      )

      await user.selectOptions(screen.getByLabelText(/priority/i), 'high')

      expect(onPriorityFilterChange).toHaveBeenCalledWith('high')
    })

    it('can select each priority level', async () => {
      const user = userEvent.setup()
      const onPriorityFilterChange = vi.fn()
      render(
        <FilterBar
          filter="all"
          onFilterChange={() => {}}
          priorityFilter="all"
          onPriorityFilterChange={onPriorityFilterChange}
        />
      )

      const prioritySelect = screen.getByLabelText(/priority/i)

      await user.selectOptions(prioritySelect, 'medium')
      expect(onPriorityFilterChange).toHaveBeenCalledWith('medium')

      await user.selectOptions(prioritySelect, 'low')
      expect(onPriorityFilterChange).toHaveBeenCalledWith('low')

      await user.selectOptions(prioritySelect, 'all')
      expect(onPriorityFilterChange).toHaveBeenCalledWith('all')
    })
  })

  describe('accessibility', () => {
    it('has tablist role for status filters', () => {
      render(
        <FilterBar
          filter="all"
          onFilterChange={() => {}}
          priorityFilter="all"
          onPriorityFilterChange={() => {}}
        />
      )

      expect(screen.getByRole('tablist', { name: /filter todos by status/i })).toBeInTheDocument()
    })

    it('has accessible label for priority dropdown', () => {
      render(
        <FilterBar
          filter="all"
          onFilterChange={() => {}}
          priorityFilter="all"
          onPriorityFilterChange={() => {}}
        />
      )

      expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    })
  })

  describe('default props', () => {
    it('defaults priorityFilter to all when not provided', () => {
      render(
        <FilterBar
          filter="all"
          onFilterChange={() => {}}
          onPriorityFilterChange={() => {}}
        />
      )

      expect(screen.getByLabelText(/priority/i)).toHaveValue('all')
    })
  })
})
