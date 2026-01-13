import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectionToolbar } from './SelectionToolbar'

describe('SelectionToolbar', () => {
  describe('visibility', () => {
    it('shows when items are selected', () => {
      render(
        <SelectionToolbar
          selectionCount={2}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })

    it('hides when no items are selected', () => {
      const { container } = render(
        <SelectionToolbar
          selectionCount={0}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('hides when selectionCount is not provided', () => {
      const { container } = render(
        <SelectionToolbar
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('selection count display', () => {
    it('displays singular text for 1 item selected', () => {
      render(
        <SelectionToolbar
          selectionCount={1}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByText('1 item selected')).toBeInTheDocument()
    })

    it('displays plural text for multiple items selected', () => {
      render(
        <SelectionToolbar
          selectionCount={5}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByText('5 items selected')).toBeInTheDocument()
    })
  })

  describe('buttons', () => {
    it('shows Complete All button', () => {
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: /mark all selected items as complete/i })).toBeInTheDocument()
    })

    it('shows Delete All button', () => {
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: /delete all selected items/i })).toBeInTheDocument()
    })

    it('shows Clear Selection button', () => {
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: /^clear selection$/i })).toBeInTheDocument()
    })
  })

  describe('callbacks', () => {
    it('calls onCompleteAll when Complete All button is clicked', async () => {
      const user = userEvent.setup()
      const onCompleteAll = vi.fn()
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={onCompleteAll}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /mark all selected items as complete/i }))

      expect(onCompleteAll).toHaveBeenCalledTimes(1)
    })

    it('calls onDeleteAll when Delete All button is clicked', async () => {
      const user = userEvent.setup()
      const onDeleteAll = vi.fn()
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={onDeleteAll}
          onClearSelection={() => {}}
        />
      )

      await user.click(screen.getByRole('button', { name: /delete all selected items/i }))

      expect(onDeleteAll).toHaveBeenCalledTimes(1)
    })

    it('calls onClearSelection when Clear Selection button is clicked', async () => {
      const user = userEvent.setup()
      const onClearSelection = vi.fn()
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={onClearSelection}
        />
      )

      await user.click(screen.getByRole('button', { name: /^clear selection$/i }))

      expect(onClearSelection).toHaveBeenCalledTimes(1)
    })
  })

  describe('accessibility', () => {
    it('has toolbar role with accessible label', () => {
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByRole('toolbar', { name: /bulk actions/i })).toBeInTheDocument()
    })

    it('has aria-live polite on selection count', () => {
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      const countElement = screen.getByText('3 items selected')
      expect(countElement).toHaveAttribute('aria-live', 'polite')
    })

    it('buttons have accessible labels', () => {
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: 'Mark all selected items as complete' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delete all selected items' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('has slide-down animation class', () => {
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      const toolbar = screen.getByRole('toolbar')
      expect(toolbar.className).toContain('animate-slide-down')
    })

    it('is fixed to top of viewport', () => {
      render(
        <SelectionToolbar
          selectionCount={3}
          onCompleteAll={() => {}}
          onDeleteAll={() => {}}
          onClearSelection={() => {}}
        />
      )

      const toolbar = screen.getByRole('toolbar')
      expect(toolbar.className).toContain('fixed')
      expect(toolbar.className).toContain('top-0')
    })
  })
})
