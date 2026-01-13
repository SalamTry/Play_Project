import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagInput, getTagColorStyle } from './TagInput'

describe('TagInput', () => {
  describe('rendering', () => {
    it('renders a text input for tag name', () => {
      render(<TagInput tags={[]} onChange={() => {}} />)

      expect(screen.getByLabelText(/tag name/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/tag name/i)).toBeInTheDocument()
    })

    it('renders 8 color picker buttons', () => {
      render(<TagInput tags={[]} onChange={() => {}} />)

      const colorButtons = screen.getAllByRole('radio')
      expect(colorButtons).toHaveLength(8)
    })

    it('renders an Add Tag button', () => {
      render(<TagInput tags={[]} onChange={() => {}} />)

      expect(screen.getByRole('button', { name: /add tag/i })).toBeInTheDocument()
    })

    it('renders existing tags as removable pills', () => {
      const tags = [
        { id: '1', name: 'Work', color: 'blue' },
        { id: '2', name: 'Personal', color: 'green' },
      ]
      render(<TagInput tags={tags} onChange={() => {}} />)

      expect(screen.getByText('Work')).toBeInTheDocument()
      expect(screen.getByText('Personal')).toBeInTheDocument()
      expect(screen.getByLabelText(/remove work tag/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/remove personal tag/i)).toBeInTheDocument()
    })

    it('does not render tag pills section when no tags', () => {
      render(<TagInput tags={[]} onChange={() => {}} />)

      expect(screen.queryByLabelText('Tags')).not.toBeInTheDocument()
    })
  })

  describe('color picker', () => {
    it('has blue selected by default', () => {
      render(<TagInput tags={[]} onChange={() => {}} />)

      const blueButton = screen.getByRole('radio', { name: /blue color/i })
      expect(blueButton).toHaveAttribute('aria-checked', 'true')
    })

    it('allows selecting different colors', async () => {
      const user = userEvent.setup()
      render(<TagInput tags={[]} onChange={() => {}} />)

      const redButton = screen.getByRole('radio', { name: /red color/i })
      await user.click(redButton)

      expect(redButton).toHaveAttribute('aria-checked', 'true')
      expect(screen.getByRole('radio', { name: /blue color/i })).toHaveAttribute('aria-checked', 'false')
    })

    it('renders all 8 predefined colors', () => {
      render(<TagInput tags={[]} onChange={() => {}} />)

      expect(screen.getByRole('radio', { name: /red color/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /orange color/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /yellow color/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /green color/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /blue color/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /indigo color/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /purple color/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /pink color/i })).toBeInTheDocument()
    })
  })

  describe('adding tags', () => {
    it('calls onChange with new tag when Add Tag button is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TagInput tags={[]} onChange={onChange} />)

      await user.type(screen.getByLabelText(/tag name/i), 'Work')
      await user.click(screen.getByRole('button', { name: /add tag/i }))

      expect(onChange).toHaveBeenCalledTimes(1)
      const newTags = onChange.mock.calls[0][0]
      expect(newTags).toHaveLength(1)
      expect(newTags[0].name).toBe('Work')
      expect(newTags[0].color).toBe('blue')
      expect(newTags[0].id).toBeDefined()
    })

    it('clears input after adding a tag', async () => {
      const user = userEvent.setup()
      render(<TagInput tags={[]} onChange={() => {}} />)

      const input = screen.getByLabelText(/tag name/i)
      await user.type(input, 'Work')
      await user.click(screen.getByRole('button', { name: /add tag/i }))

      expect(input).toHaveValue('')
    })

    it('uses selected color when adding tag', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TagInput tags={[]} onChange={onChange} />)

      await user.click(screen.getByRole('radio', { name: /red color/i }))
      await user.type(screen.getByLabelText(/tag name/i), 'Urgent')
      await user.click(screen.getByRole('button', { name: /add tag/i }))

      const newTags = onChange.mock.calls[0][0]
      expect(newTags[0].color).toBe('red')
    })

    it('does not add tag when name is empty', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TagInput tags={[]} onChange={onChange} />)

      await user.click(screen.getByRole('button', { name: /add tag/i }))

      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not add tag when name is only whitespace', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TagInput tags={[]} onChange={onChange} />)

      await user.type(screen.getByLabelText(/tag name/i), '   ')
      await user.click(screen.getByRole('button', { name: /add tag/i }))

      expect(onChange).not.toHaveBeenCalled()
    })

    it('trims whitespace from tag name', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TagInput tags={[]} onChange={onChange} />)

      await user.type(screen.getByLabelText(/tag name/i), '  Work  ')
      await user.click(screen.getByRole('button', { name: /add tag/i }))

      const newTags = onChange.mock.calls[0][0]
      expect(newTags[0].name).toBe('Work')
    })

    it('adds tag on Enter key press', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TagInput tags={[]} onChange={onChange} />)

      await user.type(screen.getByLabelText(/tag name/i), 'Work{enter}')

      expect(onChange).toHaveBeenCalledTimes(1)
      const newTags = onChange.mock.calls[0][0]
      expect(newTags[0].name).toBe('Work')
    })

    it('appends new tag to existing tags', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const existingTags = [{ id: '1', name: 'Existing', color: 'green' }]
      render(<TagInput tags={existingTags} onChange={onChange} />)

      await user.type(screen.getByLabelText(/tag name/i), 'New')
      await user.click(screen.getByRole('button', { name: /add tag/i }))

      const newTags = onChange.mock.calls[0][0]
      expect(newTags).toHaveLength(2)
      expect(newTags[0].name).toBe('Existing')
      expect(newTags[1].name).toBe('New')
    })
  })

  describe('removing tags', () => {
    it('calls onChange without the removed tag when X is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const tags = [
        { id: '1', name: 'Work', color: 'blue' },
        { id: '2', name: 'Personal', color: 'green' },
      ]
      render(<TagInput tags={tags} onChange={onChange} />)

      await user.click(screen.getByLabelText(/remove work tag/i))

      expect(onChange).toHaveBeenCalledTimes(1)
      const remainingTags = onChange.mock.calls[0][0]
      expect(remainingTags).toHaveLength(1)
      expect(remainingTags[0].name).toBe('Personal')
    })

    it('can remove all tags', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const tags = [{ id: '1', name: 'Work', color: 'blue' }]
      render(<TagInput tags={tags} onChange={onChange} />)

      await user.click(screen.getByLabelText(/remove work tag/i))

      const remainingTags = onChange.mock.calls[0][0]
      expect(remainingTags).toHaveLength(0)
    })
  })

  describe('getTagColorStyle helper', () => {
    it('returns correct style for known color', () => {
      const style = getTagColorStyle('blue')
      expect(style.name).toBe('blue')
      expect(style.bg).toContain('bg-blue')
      expect(style.text).toContain('text-blue')
    })

    it('returns first color (red) for unknown color', () => {
      const style = getTagColorStyle('unknown')
      expect(style.name).toBe('red')
    })
  })
})
