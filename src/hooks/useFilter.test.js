import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFilter } from './useFilter'

describe('useFilter', () => {
  const mockTodos = [
    { id: '1', title: 'Buy groceries', completed: false },
    { id: '2', title: 'Finish report', completed: true },
    { id: '3', title: 'Call dentist', completed: false },
    { id: '4', title: 'Pay bills', completed: true },
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
