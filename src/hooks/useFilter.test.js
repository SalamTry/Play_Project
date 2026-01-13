import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFilter } from './useFilter'

describe('useFilter', () => {
  const mockTodos = [
    { id: '1', title: 'Buy groceries', completed: false, priority: null },
    { id: '2', title: 'Finish report', completed: true, priority: 'high' },
    { id: '3', title: 'Call dentist', completed: false, priority: 'medium' },
    { id: '4', title: 'Pay bills', completed: true, priority: 'low' },
  ]

  describe('initialization', () => {
    it('initializes with filter set to "all"', () => {
      const { result } = renderHook(() => useFilter())

      expect(result.current.filter).toBe('all')
    })

    it('initializes with empty search query', () => {
      const { result } = renderHook(() => useFilter())

      expect(result.current.searchQuery).toBe('')
    })

    it('initializes with priorityFilter set to "all"', () => {
      const { result } = renderHook(() => useFilter())

      expect(result.current.priorityFilter).toBe('all')
    })

    it('initializes with selectedTags as empty array', () => {
      const { result } = renderHook(() => useFilter())

      expect(result.current.selectedTags).toEqual([])
    })
  })

  describe('setFilter', () => {
    it('updates filter to "active"', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setFilter('active')
      })

      expect(result.current.filter).toBe('active')
    })

    it('updates filter to "completed"', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setFilter('completed')
      })

      expect(result.current.filter).toBe('completed')
    })

    it('updates filter back to "all"', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setFilter('active')
      })

      act(() => {
        result.current.setFilter('all')
      })

      expect(result.current.filter).toBe('all')
    })
  })

  describe('setPriorityFilter', () => {
    it('updates priority filter to "high"', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setPriorityFilter('high')
      })

      expect(result.current.priorityFilter).toBe('high')
    })

    it('updates priority filter to "medium"', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setPriorityFilter('medium')
      })

      expect(result.current.priorityFilter).toBe('medium')
    })

    it('updates priority filter to "low"', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setPriorityFilter('low')
      })

      expect(result.current.priorityFilter).toBe('low')
    })

    it('updates priority filter back to "all"', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setPriorityFilter('high')
      })

      act(() => {
        result.current.setPriorityFilter('all')
      })

      expect(result.current.priorityFilter).toBe('all')
    })
  })

  describe('setSelectedTags', () => {
    it('updates selectedTags with tag IDs', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setSelectedTags(['tag-1', 'tag-2'])
      })

      expect(result.current.selectedTags).toEqual(['tag-1', 'tag-2'])
    })

    it('clears selectedTags with empty array', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setSelectedTags(['tag-1'])
      })

      act(() => {
        result.current.setSelectedTags([])
      })

      expect(result.current.selectedTags).toEqual([])
    })

    it('replaces previous selection', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setSelectedTags(['tag-1', 'tag-2'])
      })

      act(() => {
        result.current.setSelectedTags(['tag-3'])
      })

      expect(result.current.selectedTags).toEqual(['tag-3'])
    })
  })

  describe('setSearchQuery', () => {
    it('updates search query', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setSearchQuery('groceries')
      })

      expect(result.current.searchQuery).toBe('groceries')
    })

    it('clears search query', () => {
      const { result } = renderHook(() => useFilter())

      act(() => {
        result.current.setSearchQuery('groceries')
      })

      act(() => {
        result.current.setSearchQuery('')
      })

      expect(result.current.searchQuery).toBe('')
    })
  })

  describe('filterTodos', () => {
    describe('filter by status', () => {
      it('returns all todos when filter is "all"', () => {
        const { result } = renderHook(() => useFilter())

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(4)
        expect(filtered).toEqual(mockTodos)
      })

      it('returns only active (incomplete) todos when filter is "active"', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setFilter('active')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(2)
        expect(filtered.every((todo) => !todo.completed)).toBe(true)
        expect(filtered.map((t) => t.id)).toEqual(['1', '3'])
      })

      it('returns only completed todos when filter is "completed"', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setFilter('completed')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(2)
        expect(filtered.every((todo) => todo.completed)).toBe(true)
        expect(filtered.map((t) => t.id)).toEqual(['2', '4'])
      })
    })

    describe('filter by priority', () => {
      it('returns all todos when priority filter is "all"', () => {
        const { result } = renderHook(() => useFilter())

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(4)
      })

      it('returns only high priority todos when priority filter is "high"', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setPriorityFilter('high')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].priority).toBe('high')
        expect(filtered[0].title).toBe('Finish report')
      })

      it('returns only medium priority todos when priority filter is "medium"', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setPriorityFilter('medium')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].priority).toBe('medium')
        expect(filtered[0].title).toBe('Call dentist')
      })

      it('returns only low priority todos when priority filter is "low"', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setPriorityFilter('low')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].priority).toBe('low')
        expect(filtered[0].title).toBe('Pay bills')
      })
    })

    describe('filter by search query', () => {
      it('returns todos matching search query (case-insensitive)', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSearchQuery('Buy')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].title).toBe('Buy groceries')
      })

      it('returns todos matching lowercase search', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSearchQuery('report')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].title).toBe('Finish report')
      })

      it('returns empty array when no todos match search', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSearchQuery('nonexistent')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(0)
      })

      it('trims whitespace from search query', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSearchQuery('  groceries  ')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].title).toBe('Buy groceries')
      })

      it('ignores empty search query', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSearchQuery('   ')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(4)
      })
    })

    describe('combined filter and search', () => {
      it('applies both filter and search query', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setFilter('active')
          result.current.setSearchQuery('call')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].title).toBe('Call dentist')
        expect(filtered[0].completed).toBe(false)
      })

      it('returns empty when filter and search have no intersection', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setFilter('completed')
          result.current.setSearchQuery('groceries')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(0)
      })

      it('handles completed filter with search', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setFilter('completed')
          result.current.setSearchQuery('bills')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].title).toBe('Pay bills')
      })

      it('applies status, priority, and search filters together', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setFilter('completed')
          result.current.setPriorityFilter('high')
          result.current.setSearchQuery('report')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].title).toBe('Finish report')
        expect(filtered[0].completed).toBe(true)
        expect(filtered[0].priority).toBe('high')
      })

      it('returns empty when combined filters have no match', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setFilter('active')
          result.current.setPriorityFilter('high')
        })

        const filtered = result.current.filterTodos(mockTodos)

        expect(filtered).toHaveLength(0)
      })
    })

    describe('filter by tags', () => {
      const mockTodosWithTags = [
        {
          id: '1',
          title: 'Buy groceries',
          completed: false,
          priority: null,
          tags: [
            { id: 'tag-1', name: 'Shopping', color: '#ff0000' },
            { id: 'tag-2', name: 'Personal', color: '#00ff00' },
          ],
        },
        {
          id: '2',
          title: 'Finish report',
          completed: true,
          priority: 'high',
          tags: [{ id: 'tag-3', name: 'Work', color: '#0000ff' }],
        },
        {
          id: '3',
          title: 'Call dentist',
          completed: false,
          priority: 'medium',
          tags: [{ id: 'tag-2', name: 'Personal', color: '#00ff00' }],
        },
        {
          id: '4',
          title: 'Pay bills',
          completed: true,
          priority: 'low',
          tags: [],
        },
        {
          id: '5',
          title: 'Clean room',
          completed: false,
          priority: null,
        },
      ]

      it('returns all todos when selectedTags is empty', () => {
        const { result } = renderHook(() => useFilter())

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered).toHaveLength(5)
      })

      it('filters todos by single selected tag', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSelectedTags(['tag-1'])
        })

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].title).toBe('Buy groceries')
      })

      it('filters todos matching ANY selected tag (multi-select)', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSelectedTags(['tag-1', 'tag-3'])
        })

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered).toHaveLength(2)
        expect(filtered.map((t) => t.id)).toEqual(['1', '2'])
      })

      it('returns multiple todos when they share the same tag', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSelectedTags(['tag-2'])
        })

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered).toHaveLength(2)
        expect(filtered.map((t) => t.title)).toEqual([
          'Buy groceries',
          'Call dentist',
        ])
      })

      it('returns empty array when no todos have selected tags', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSelectedTags(['nonexistent-tag'])
        })

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered).toHaveLength(0)
      })

      it('excludes todos without tags when tag filter is active', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSelectedTags(['tag-2'])
        })

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered.find((t) => t.id === '4')).toBeUndefined()
        expect(filtered.find((t) => t.id === '5')).toBeUndefined()
      })

      it('handles todos with undefined tags gracefully', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSelectedTags(['tag-2'])
        })

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered).toHaveLength(2)
      })

      it('combines tag filter with status filter', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setFilter('active')
          result.current.setSelectedTags(['tag-2'])
        })

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered).toHaveLength(2)
        expect(filtered.every((t) => !t.completed)).toBe(true)
      })

      it('combines tag filter with search query', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setSearchQuery('dentist')
          result.current.setSelectedTags(['tag-2'])
        })

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].title).toBe('Call dentist')
      })

      it('combines tag, status, priority, and search filters', () => {
        const { result } = renderHook(() => useFilter())

        act(() => {
          result.current.setFilter('active')
          result.current.setPriorityFilter('medium')
          result.current.setSelectedTags(['tag-2'])
          result.current.setSearchQuery('call')
        })

        const filtered = result.current.filterTodos(mockTodosWithTags)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].title).toBe('Call dentist')
      })
    })

    describe('edge cases', () => {
      it('handles empty todos array', () => {
        const { result } = renderHook(() => useFilter())

        const filtered = result.current.filterTodos([])

        expect(filtered).toEqual([])
      })

      it('handles todos without title gracefully', () => {
        const { result } = renderHook(() => useFilter())
        const todosWithEmptyTitle = [
          { id: '1', title: '', completed: false },
        ]

        act(() => {
          result.current.setSearchQuery('test')
        })

        const filtered = result.current.filterTodos(todosWithEmptyTitle)

        expect(filtered).toHaveLength(0)
      })

      it('returns same reference-stable function', () => {
        const { result, rerender } = renderHook(() => useFilter())

        const firstFilterTodos = result.current.filterTodos

        rerender()

        expect(result.current.filterTodos).toBe(firstFilterTodos)
      })
    })
  })
})
