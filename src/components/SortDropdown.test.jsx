import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SortDropdown } from './SortDropdown'

describe('SortDropdown', () => {
  const defaultProps = {
    sortBy: 'custom',
    onSortByChange: vi.fn(),
    sortDirection: 'asc',
    onSortDirectionChange: vi.fn(),
  }

  function getDropdownButton() {
    return screen.getByRole('button', { name: /sort by/i })
  }

  describe('rendering', () => {
    it('renders sort label', () => {
      render(<SortDropdown {...defaultProps} />)

      expect(screen.getByText('Sort:')).toBeInTheDocument()
    })

    it('renders dropdown button with current sort option', () => {
      render(<SortDropdown {...defaultProps} sortBy="custom" />)

      expect(screen.getByRole('button', { name: /sort by custom order/i })).toBeInTheDocument()
    })

    it('renders direction toggle button', () => {
      render(<SortDropdown {...defaultProps} />)

      expect(screen.getByRole('button', { name: /sort direction/i })).toBeInTheDocument()
    })

    it('displays correct label for each sort option', () => {
      const { rerender } = render(<SortDropdown {...defaultProps} sortBy="custom" />)
      expect(screen.getByRole('button', { name: /sort by custom order/i })).toBeInTheDocument()

      rerender(<SortDropdown {...defaultProps} sortBy="date" />)
      expect(screen.getByRole('button', { name: /sort by date created/i })).toBeInTheDocument()

      rerender(<SortDropdown {...defaultProps} sortBy="priority" />)
      expect(screen.getByRole('button', { name: /sort by priority/i })).toBeInTheDocument()

      rerender(<SortDropdown {...defaultProps} sortBy="alpha" />)
      expect(screen.getByRole('button', { name: /sort by alphabetical/i })).toBeInTheDocument()
    })

    it('has correct aria-expanded state when closed', () => {
      render(<SortDropdown {...defaultProps} />)

      expect(getDropdownButton()).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('dropdown interactions', () => {
    it('opens dropdown when button is clicked', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())

      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(getDropdownButton()).toHaveAttribute('aria-expanded', 'true')
    })

    it('shows all sort options in dropdown', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())

      expect(screen.getByRole('option', { name: /custom order/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /date created/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /priority/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /alphabetical/i })).toBeInTheDocument()
    })

    it('highlights current sort option', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} sortBy="priority" />)

      await user.click(getDropdownButton())

      expect(screen.getByRole('option', { name: /priority/i })).toHaveAttribute(
        'aria-selected',
        'true'
      )
      expect(screen.getByRole('option', { name: /custom order/i })).toHaveAttribute(
        'aria-selected',
        'false'
      )
    })

    it('calls onSortByChange when option is selected', async () => {
      const user = userEvent.setup()
      const onSortByChange = vi.fn()
      render(<SortDropdown {...defaultProps} onSortByChange={onSortByChange} />)

      await user.click(getDropdownButton())
      await user.click(screen.getByRole('option', { name: /date created/i }))

      expect(onSortByChange).toHaveBeenCalledWith('date')
    })

    it('closes dropdown after selection', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())
      await user.click(screen.getByRole('option', { name: /priority/i }))

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('closes dropdown when clicking outside', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <SortDropdown {...defaultProps} />
          <button>Outside</button>
        </div>
      )

      await user.click(getDropdownButton())
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      await user.click(screen.getByText('Outside'))
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())
      expect(screen.getByRole('listbox')).toBeInTheDocument()

      await user.keyboard('{Escape}')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('direction toggle', () => {
    it('shows ascending direction by default', () => {
      render(<SortDropdown {...defaultProps} sortDirection="asc" />)

      expect(
        screen.getByRole('button', { name: /sort direction: ascending/i })
      ).toBeInTheDocument()
    })

    it('shows descending direction when set', () => {
      render(<SortDropdown {...defaultProps} sortDirection="desc" />)

      expect(
        screen.getByRole('button', { name: /sort direction: descending/i })
      ).toBeInTheDocument()
    })

    it('calls onSortDirectionChange when toggle is clicked (asc to desc)', async () => {
      const user = userEvent.setup()
      const onSortDirectionChange = vi.fn()
      render(
        <SortDropdown
          {...defaultProps}
          sortDirection="asc"
          onSortDirectionChange={onSortDirectionChange}
        />
      )

      await user.click(screen.getByRole('button', { name: /sort direction/i }))

      expect(onSortDirectionChange).toHaveBeenCalledWith('desc')
    })

    it('calls onSortDirectionChange when toggle is clicked (desc to asc)', async () => {
      const user = userEvent.setup()
      const onSortDirectionChange = vi.fn()
      render(
        <SortDropdown
          {...defaultProps}
          sortDirection="desc"
          onSortDirectionChange={onSortDirectionChange}
        />
      )

      await user.click(screen.getByRole('button', { name: /sort direction/i }))

      expect(onSortDirectionChange).toHaveBeenCalledWith('asc')
    })
  })

  describe('keyboard navigation', () => {
    it('opens dropdown with Enter key', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())
      await user.keyboard('{Escape}')
      await user.keyboard('{Enter}')

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('opens dropdown with Space key', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())
      await user.keyboard('{Escape}')
      await user.keyboard(' ')

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('opens dropdown with ArrowDown key', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())
      await user.keyboard('{Escape}')
      await user.keyboard('{ArrowDown}')

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('opens dropdown with ArrowUp key', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())
      await user.keyboard('{Escape}')
      await user.keyboard('{ArrowUp}')

      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has correct aria attributes on dropdown button', () => {
      render(<SortDropdown {...defaultProps} />)

      const button = getDropdownButton()
      expect(button).toHaveAttribute('aria-haspopup', 'listbox')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('has correct aria-label on listbox', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())

      expect(screen.getByRole('listbox')).toHaveAttribute('aria-label', 'Sort options')
    })

    it('direction toggle has descriptive aria-label', () => {
      render(<SortDropdown {...defaultProps} sortDirection="asc" />)

      expect(
        screen.getByRole('button', { name: /sort direction: ascending. click to toggle/i })
      ).toBeInTheDocument()
    })
  })

  describe('default props', () => {
    it('defaults sortBy to custom', () => {
      render(
        <SortDropdown
          onSortByChange={vi.fn()}
          sortDirection="asc"
          onSortDirectionChange={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: /sort by custom order/i })).toBeInTheDocument()
    })

    it('defaults sortDirection to asc', () => {
      render(
        <SortDropdown sortBy="custom" onSortByChange={vi.fn()} onSortDirectionChange={vi.fn()} />
      )

      expect(
        screen.getByRole('button', { name: /sort direction: ascending/i })
      ).toBeInTheDocument()
    })
  })

  describe('icons', () => {
    it('displays icon for each sort option in dropdown', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} />)

      await user.click(getDropdownButton())

      const options = screen.getAllByRole('option')
      options.forEach((option) => {
        expect(option.querySelector('svg')).toBeInTheDocument()
      })
    })

    it('displays checkmark for selected option', async () => {
      const user = userEvent.setup()
      render(<SortDropdown {...defaultProps} sortBy="priority" />)

      await user.click(getDropdownButton())

      const priorityOption = screen.getByRole('option', { name: /priority/i })
      const svgs = priorityOption.querySelectorAll('svg')
      expect(svgs.length).toBe(2)
    })
  })
})
