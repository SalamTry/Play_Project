import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'

describe('KeyboardShortcutsHelp', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    render(<KeyboardShortcutsHelp isOpen={false} onClose={mockOnClose} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders modal when isOpen is true', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
  })

  it('lists all keyboard shortcuts with descriptions', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Focus new todo input')).toBeInTheDocument()
    expect(screen.getByText('Focus search input')).toBeInTheDocument()
    expect(screen.getByText('Show all todos')).toBeInTheDocument()
    expect(screen.getByText('Show active todos')).toBeInTheDocument()
    expect(screen.getByText('Show completed todos')).toBeInTheDocument()
    expect(screen.getByText('Close modal / Clear selection')).toBeInTheDocument()
    expect(screen.getByText('Delete selected todo')).toBeInTheDocument()
    expect(screen.getByText('Show keyboard shortcuts')).toBeInTheDocument()
  })

  it('displays keyboard keys with proper styling', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    const ctrlKeys = screen.getAllByText('Ctrl')
    expect(ctrlKeys.length).toBeGreaterThan(0)
    ctrlKeys.forEach((key) => {
      expect(key.tagName).toBe('KBD')
    })
  })

  it('closes on Escape key press', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    const dialog = screen.getByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Escape' })

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('closes when clicking the close button', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    const closeButton = screen.getByRole('button', { name: /close keyboard shortcuts/i })
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('closes when clicking outside the modal (backdrop)', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    const backdrop = screen.getByRole('dialog')
    fireEvent.click(backdrop)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking inside the modal', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    const title = screen.getByText('Keyboard Shortcuts')
    fireEvent.click(title)

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'shortcuts-modal-title')

    const title = screen.getByText('Keyboard Shortcuts')
    expect(title).toHaveAttribute('id', 'shortcuts-modal-title')
  })

  it('focuses the close button when opened', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    const closeButton = screen.getByRole('button', { name: /close keyboard shortcuts/i })
    expect(document.activeElement).toBe(closeButton)
  })

  it('traps focus within the modal', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    const closeButton = screen.getByRole('button', { name: /close keyboard shortcuts/i })

    // Focus is on close button, pressing Tab should keep focus within modal
    fireEvent.keyDown(closeButton, { key: 'Tab' })

    // Since there's only one focusable element, Tab should wrap around
    expect(document.activeElement).toBe(closeButton)
  })

  it('shows Mac-specific note about Cmd key', () => {
    render(<KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText(/on mac, use/i)).toBeInTheDocument()
    expect(screen.getByText('Cmd')).toBeInTheDocument()
  })
})
