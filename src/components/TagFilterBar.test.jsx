import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagFilterBar } from './TagFilterBar'

describe('TagFilterBar', () => {
  const mockTodos = [
    {
      id: '1',
      title: 'Todo 1',
      tags: [
        { id: 'tag-1', name: 'Work', color: 'blue' },
        { id: 'tag-2', name: 'Urgent', color: 'red' },
      ],
    },
    {
      id: '2',
      title: 'Todo 2',
      tags: [
        { id: 'tag-2', name: 'Urgent', color: 'red' },
        { id: 'tag-3', name: 'Personal', color: 'green' },
      ],
    },
    {
      id: '3',
      title: 'Todo 3',
      tags: [],
    },
  ]

  describe('rendering', () => {
    it('shows all unique tags from todos', () => {
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={[]}
          onSelectedTagsChange={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: 'Work' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Urgent' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Personal' })).toBeInTheDocument()
    })

    it('does not render duplicate tags', () => {
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={[]}
          onSelectedTagsChange={() => {}}
        />
      )

      // Urgent appears in 2 todos but should only render once
      const urgentButtons = screen.getAllByRole('button', { name: 'Urgent' })
      expect(urgentButtons).toHaveLength(1)
    })

    it('returns null when there are no tags', () => {
      const { container } = render(
        <TagFilterBar
          todos={[{ id: '1', title: 'No tags', tags: [] }]}
          selectedTags={[]}
          onSelectedTagsChange={() => {}}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when todos array is empty', () => {
      const { container } = render(
        <TagFilterBar
          todos={[]}
          selectedTags={[]}
          onSelectedTagsChange={() => {}}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('handles todos without tags property', () => {
      const { container } = render(
        <TagFilterBar
          todos={[{ id: '1', title: 'No tags prop' }]}
          selectedTags={[]}
          onSelectedTagsChange={() => {}}
        />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('tag selection', () => {
    it('marks selected tags with aria-pressed true', () => {
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={['tag-1']}
          onSelectedTagsChange={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: 'Work' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'Urgent' })).toHaveAttribute('aria-pressed', 'false')
    })

    it('calls onSelectedTagsChange with tag id when clicking unselected tag', async () => {
      const user = userEvent.setup()
      const onSelectedTagsChange = vi.fn()
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={[]}
          onSelectedTagsChange={onSelectedTagsChange}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Work' }))

      expect(onSelectedTagsChange).toHaveBeenCalledWith(['tag-1'])
    })

    it('calls onSelectedTagsChange without tag id when clicking selected tag', async () => {
      const user = userEvent.setup()
      const onSelectedTagsChange = vi.fn()
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={['tag-1', 'tag-2']}
          onSelectedTagsChange={onSelectedTagsChange}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Work' }))

      expect(onSelectedTagsChange).toHaveBeenCalledWith(['tag-2'])
    })

    it('can select multiple tags', async () => {
      const user = userEvent.setup()
      const onSelectedTagsChange = vi.fn()
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={['tag-1']}
          onSelectedTagsChange={onSelectedTagsChange}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Urgent' }))

      expect(onSelectedTagsChange).toHaveBeenCalledWith(['tag-1', 'tag-2'])
    })
  })

  describe('clear all filters button', () => {
    it('shows clear all button when tags are selected', () => {
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={['tag-1']}
          onSelectedTagsChange={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
    })

    it('hides clear all button when no tags are selected', () => {
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={[]}
          onSelectedTagsChange={() => {}}
        />
      )

      expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()
    })

    it('calls onSelectedTagsChange with empty array when clicking clear all', async () => {
      const user = userEvent.setup()
      const onSelectedTagsChange = vi.fn()
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={['tag-1', 'tag-2']}
          onSelectedTagsChange={onSelectedTagsChange}
        />
      )

      await user.click(screen.getByRole('button', { name: /clear filters/i }))

      expect(onSelectedTagsChange).toHaveBeenCalledWith([])
    })
  })

  describe('styling', () => {
    it('applies highlighted style to selected tags', () => {
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={['tag-1']}
          onSelectedTagsChange={() => {}}
        />
      )

      const selectedTag = screen.getByRole('button', { name: 'Work' })
      const unselectedTag = screen.getByRole('button', { name: 'Urgent' })

      // Selected tag has ring
      expect(selectedTag.className).toContain('ring-2')
      // Unselected tag has opacity
      expect(unselectedTag.className).toContain('opacity-60')
    })
  })

  describe('accessibility', () => {
    it('has group role with accessible label', () => {
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={[]}
          onSelectedTagsChange={() => {}}
        />
      )

      expect(screen.getByRole('group', { name: /filter by tags/i })).toBeInTheDocument()
    })

    it('tags are clickable buttons', () => {
      render(
        <TagFilterBar
          todos={mockTodos}
          selectedTags={[]}
          onSelectedTagsChange={() => {}}
        />
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(3) // Work, Urgent, Personal
    })
  })

  describe('default props', () => {
    it('handles missing todos prop', () => {
      const { container } = render(
        <TagFilterBar
          selectedTags={[]}
          onSelectedTagsChange={() => {}}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('handles missing selectedTags prop', () => {
      render(
        <TagFilterBar
          todos={mockTodos}
          onSelectedTagsChange={() => {}}
        />
      )

      // All tags should be rendered as unselected
      const workTag = screen.getByRole('button', { name: 'Work' })
      expect(workTag).toHaveAttribute('aria-pressed', 'false')
    })
  })
})
