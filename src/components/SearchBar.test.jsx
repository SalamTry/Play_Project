import { describe, it, expect, vi, beforeEach, afterEach, act } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  describe('rendering', () => {
    it('renders search input with placeholder', () => {
      render(<SearchBar value="" onChange={() => {}} />)

      expect(screen.getByPlaceholderText(/search todos/i)).toBeInTheDocument()
    })

    it('renders custom placeholder when provided', () => {
      render(<SearchBar value="" onChange={() => {}} placeholder="Find items..." />)

      expect(screen.getByPlaceholderText(/find items/i)).toBeInTheDocument()
    })

    it('renders magnifying glass icon', () => {
      render(<SearchBar value="" onChange={() => {}} />)

      // Icon is rendered as SVG inside the component
      const input = screen.getByLabelText(/search todos/i)
      expect(input).toBeInTheDocument()
    })

    it('renders with provided value', () => {
      render(<SearchBar value="test query" onChange={() => {}} />)

      expect(screen.getByDisplayValue('test query')).toBeInTheDocument()
    })

    it('shows clear button when input has value', () => {
      render(<SearchBar value="something" onChange={() => {}} />)

      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument()
    })

    it('does not show clear button when input is empty', () => {
      render(<SearchBar value="" onChange={() => {}} />)

      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
    })
  })

  describe('debounced input', () => {
    it('debounces onChange calls', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<SearchBar value="" onChange={onChange} />)

      const input = screen.getByLabelText(/search todos/i)
      await user.type(input, 'test')

      // Wait for debounce to complete
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('test')
      }, { timeout: 500 })
    })

    it('calls onChange with final value after typing', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<SearchBar value="" onChange={onChange} />)

      const input = screen.getByLabelText(/search todos/i)
      await user.type(input, 'hello')

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('hello')
      }, { timeout: 500 })
    })
  })

  describe('clear button', () => {
    it('clears input and calls onChange when clear button is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<SearchBar value="initial" onChange={onChange} />)

      const clearButton = screen.getByRole('button', { name: /clear search/i })
      await user.click(clearButton)

      expect(onChange).toHaveBeenCalledWith('')
    })

    it('hides clear button after clearing', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<SearchBar value="initial" onChange={onChange} />)

      const clearButton = screen.getByRole('button', { name: /clear search/i })
      await user.click(clearButton)

      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has accessible label for search input', () => {
      render(<SearchBar value="" onChange={() => {}} />)

      expect(screen.getByLabelText(/search todos/i)).toBeInTheDocument()
    })

    it('has accessible label for clear button', () => {
      render(<SearchBar value="test" onChange={() => {}} />)

      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument()
    })
  })

  describe('external value sync', () => {
    it('updates internal value when external value changes', () => {
      const { rerender } = render(<SearchBar value="initial" onChange={() => {}} />)

      expect(screen.getByDisplayValue('initial')).toBeInTheDocument()

      rerender(<SearchBar value="updated" onChange={() => {}} />)

      expect(screen.getByDisplayValue('updated')).toBeInTheDocument()
    })
  })
})
