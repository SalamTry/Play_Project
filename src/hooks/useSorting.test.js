import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSorting } from './useSorting'

describe('useSorting', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const mockTodos = [
    {
      id: '1',
      title: 'Buy groceries',
      completed: false,
      priority: 'low',
      order: 3,
      createdAt: '2024-01-03T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'Finish report',
      completed: true,
      priority: 'high',
      order: 1,
      createdAt: '2024-01-01T10:00:00.000Z',
    },
    {
      id: '3',
      title: 'Call dentist',
      completed: false,
      priority: 'medium',
      order: 2,
      createdAt: '2024-01-02T10:00:00.000Z',
    },
    {
      id: '4',
      title: 'Pay bills',
      completed: true,
      priority: null,
      order: 4,
      createdAt: '2024-01-04T10:00:00.000Z',
    },
  ]

  describe('initialization', () => {
    it('initializes with sortBy set to "custom"', () => {
      const { result } = renderHook(() => useSorting())

      expect(result.current.sortBy).toBe('custom')
    })

    it('initializes with sortDirection set to "asc"', () => {
      const { result } = renderHook(() => useSorting())

      expect(result.current.sortDirection).toBe('asc')
    })

    it('loads sortBy from localStorage', () => {
      localStorage.setItem(
        'todo-sorting',
        JSON.stringify({ sortBy: 'date', sortDirection: 'asc' })
      )

      const { result } = renderHook(() => useSorting())

      expect(result.current.sortBy).toBe('date')
    })

    it('loads sortDirection from localStorage', () => {
      localStorage.setItem(
        'todo-sorting',
        JSON.stringify({ sortBy: 'custom', sortDirection: 'desc' })
      )

      const { result } = renderHook(() => useSorting())

      expect(result.current.sortDirection).toBe('desc')
    })

    it('falls back to defaults for invalid localStorage values', () => {
      localStorage.setItem(
        'todo-sorting',
        JSON.stringify({ sortBy: 'invalid', sortDirection: 'invalid' })
      )

      const { result } = renderHook(() => useSorting())

      expect(result.current.sortBy).toBe('custom')
      expect(result.current.sortDirection).toBe('asc')
    })

    it('falls back to defaults for corrupted localStorage', () => {
      localStorage.setItem('todo-sorting', 'not-valid-json')

      const { result } = renderHook(() => useSorting())

      expect(result.current.sortBy).toBe('custom')
      expect(result.current.sortDirection).toBe('asc')
    })
  })

  describe('setSortBy', () => {
    it('updates sortBy to "date"', () => {
      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortBy('date')
      })

      expect(result.current.sortBy).toBe('date')
    })

    it('updates sortBy to "priority"', () => {
      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortBy('priority')
      })

      expect(result.current.sortBy).toBe('priority')
    })

    it('updates sortBy to "alpha"', () => {
      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortBy('alpha')
      })

      expect(result.current.sortBy).toBe('alpha')
    })

    it('updates sortBy back to "custom"', () => {
      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortBy('date')
      })

      act(() => {
        result.current.setSortBy('custom')
      })

      expect(result.current.sortBy).toBe('custom')
    })

    it('persists sortBy to localStorage', () => {
      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortBy('priority')
      })

      const stored = JSON.parse(localStorage.getItem('todo-sorting'))
      expect(stored.sortBy).toBe('priority')
    })
  })

  describe('setSortDirection', () => {
    it('updates sortDirection to "desc"', () => {
      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortDirection('desc')
      })

      expect(result.current.sortDirection).toBe('desc')
    })

    it('updates sortDirection back to "asc"', () => {
      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortDirection('desc')
      })

      act(() => {
        result.current.setSortDirection('asc')
      })

      expect(result.current.sortDirection).toBe('asc')
    })

    it('persists sortDirection to localStorage', () => {
      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortDirection('desc')
      })

      const stored = JSON.parse(localStorage.getItem('todo-sorting'))
      expect(stored.sortDirection).toBe('desc')
    })
  })

  describe('sortTodos', () => {
    describe('sort by custom order', () => {
      it('sorts by order ascending', () => {
        const { result } = renderHook(() => useSorting())

        const sorted = result.current.sortTodos(mockTodos)

        expect(sorted.map((t) => t.id)).toEqual(['2', '3', '1', '4'])
      })

      it('sorts by order descending', () => {
        const { result } = renderHook(() => useSorting())

        act(() => {
          result.current.setSortDirection('desc')
        })

        const sorted = result.current.sortTodos(mockTodos)

        expect(sorted.map((t) => t.id)).toEqual(['4', '1', '3', '2'])
      })

      it('handles todos without order field', () => {
        const { result } = renderHook(() => useSorting())
        const todosWithoutOrder = [
          { id: '1', title: 'First' },
          { id: '2', title: 'Second', order: 1 },
        ]

        const sorted = result.current.sortTodos(todosWithoutOrder)

        expect(sorted.map((t) => t.id)).toEqual(['1', '2'])
      })
    })

    describe('sort by date', () => {
      it('sorts by createdAt ascending', () => {
        const { result } = renderHook(() => useSorting())

        act(() => {
          result.current.setSortBy('date')
        })

        const sorted = result.current.sortTodos(mockTodos)

        expect(sorted.map((t) => t.id)).toEqual(['2', '3', '1', '4'])
      })

      it('sorts by createdAt descending', () => {
        const { result } = renderHook(() => useSorting())

        act(() => {
          result.current.setSortBy('date')
          result.current.setSortDirection('desc')
        })

        const sorted = result.current.sortTodos(mockTodos)

        expect(sorted.map((t) => t.id)).toEqual(['4', '1', '3', '2'])
      })

      it('handles todos without createdAt field', () => {
        const { result } = renderHook(() => useSorting())
        const todosWithoutDate = [
          { id: '1', title: 'No date' },
          { id: '2', title: 'Has date', createdAt: '2024-01-01T10:00:00.000Z' },
        ]

        act(() => {
          result.current.setSortBy('date')
        })

        const sorted = result.current.sortTodos(todosWithoutDate)

        expect(sorted.map((t) => t.id)).toEqual(['1', '2'])
      })
    })

    describe('sort by priority', () => {
      it('sorts by priority ascending (null/low first)', () => {
        const { result } = renderHook(() => useSorting())

        act(() => {
          result.current.setSortBy('priority')
        })

        const sorted = result.current.sortTodos(mockTodos)

        expect(sorted.map((t) => t.id)).toEqual(['4', '1', '3', '2'])
      })

      it('sorts by priority descending (high first)', () => {
        const { result } = renderHook(() => useSorting())

        act(() => {
          result.current.setSortBy('priority')
          result.current.setSortDirection('desc')
        })

        const sorted = result.current.sortTodos(mockTodos)

        expect(sorted.map((t) => t.id)).toEqual(['2', '3', '1', '4'])
      })

      it('handles todos with undefined priority', () => {
        const { result } = renderHook(() => useSorting())
        const todosWithUndefinedPriority = [
          { id: '1', title: 'High', priority: 'high' },
          { id: '2', title: 'Undefined' },
          { id: '3', title: 'Null', priority: null },
        ]

        act(() => {
          result.current.setSortBy('priority')
          result.current.setSortDirection('desc')
        })

        const sorted = result.current.sortTodos(todosWithUndefinedPriority)

        expect(sorted[0].id).toBe('1')
      })
    })

    describe('sort by alpha', () => {
      it('sorts alphabetically ascending', () => {
        const { result } = renderHook(() => useSorting())

        act(() => {
          result.current.setSortBy('alpha')
        })

        const sorted = result.current.sortTodos(mockTodos)

        expect(sorted.map((t) => t.title)).toEqual([
          'Buy groceries',
          'Call dentist',
          'Finish report',
          'Pay bills',
        ])
      })

      it('sorts alphabetically descending', () => {
        const { result } = renderHook(() => useSorting())

        act(() => {
          result.current.setSortBy('alpha')
          result.current.setSortDirection('desc')
        })

        const sorted = result.current.sortTodos(mockTodos)

        expect(sorted.map((t) => t.title)).toEqual([
          'Pay bills',
          'Finish report',
          'Call dentist',
          'Buy groceries',
        ])
      })

      it('sorts case-insensitively', () => {
        const { result } = renderHook(() => useSorting())
        const mixedCaseTodos = [
          { id: '1', title: 'Zebra' },
          { id: '2', title: 'apple' },
          { id: '3', title: 'Banana' },
        ]

        act(() => {
          result.current.setSortBy('alpha')
        })

        const sorted = result.current.sortTodos(mixedCaseTodos)

        expect(sorted.map((t) => t.title)).toEqual(['apple', 'Banana', 'Zebra'])
      })

      it('handles todos with empty title', () => {
        const { result } = renderHook(() => useSorting())
        const todosWithEmptyTitle = [
          { id: '1', title: 'Beta' },
          { id: '2', title: '' },
          { id: '3', title: 'Alpha' },
        ]

        act(() => {
          result.current.setSortBy('alpha')
        })

        const sorted = result.current.sortTodos(todosWithEmptyTitle)

        expect(sorted.map((t) => t.id)).toEqual(['2', '3', '1'])
      })

      it('handles todos without title field', () => {
        const { result } = renderHook(() => useSorting())
        const todosWithoutTitle = [
          { id: '1', title: 'Beta' },
          { id: '2' },
          { id: '3', title: 'Alpha' },
        ]

        act(() => {
          result.current.setSortBy('alpha')
        })

        const sorted = result.current.sortTodos(todosWithoutTitle)

        expect(sorted.map((t) => t.id)).toEqual(['2', '3', '1'])
      })
    })

    describe('edge cases', () => {
      it('handles empty todos array', () => {
        const { result } = renderHook(() => useSorting())

        const sorted = result.current.sortTodos([])

        expect(sorted).toEqual([])
      })

      it('handles null todos', () => {
        const { result } = renderHook(() => useSorting())

        const sorted = result.current.sortTodos(null)

        expect(sorted).toBeNull()
      })

      it('handles undefined todos', () => {
        const { result } = renderHook(() => useSorting())

        const sorted = result.current.sortTodos(undefined)

        expect(sorted).toBeUndefined()
      })

      it('does not mutate original array', () => {
        const { result } = renderHook(() => useSorting())
        const original = [...mockTodos]
        const originalIds = mockTodos.map((t) => t.id)

        result.current.sortTodos(mockTodos)

        expect(mockTodos.map((t) => t.id)).toEqual(originalIds)
      })

      it('handles single item array', () => {
        const { result } = renderHook(() => useSorting())
        const singleTodo = [{ id: '1', title: 'Only one' }]

        const sorted = result.current.sortTodos(singleTodo)

        expect(sorted).toHaveLength(1)
        expect(sorted[0].id).toBe('1')
      })
    })
  })

  describe('function stability', () => {
    it('setSortBy maintains reference between renders', () => {
      const { result, rerender } = renderHook(() => useSorting())

      const firstSetSortBy = result.current.setSortBy

      rerender()

      expect(result.current.setSortBy).toBe(firstSetSortBy)
    })

    it('setSortDirection maintains reference between renders', () => {
      const { result, rerender } = renderHook(() => useSorting())

      const firstSetSortDirection = result.current.setSortDirection

      rerender()

      expect(result.current.setSortDirection).toBe(firstSetSortDirection)
    })

    it('sortTodos updates when sortBy changes', () => {
      const { result } = renderHook(() => useSorting())

      const firstSortTodos = result.current.sortTodos

      act(() => {
        result.current.setSortBy('date')
      })

      expect(result.current.sortTodos).not.toBe(firstSortTodos)
    })

    it('sortTodos updates when sortDirection changes', () => {
      const { result } = renderHook(() => useSorting())

      const firstSortTodos = result.current.sortTodos

      act(() => {
        result.current.setSortDirection('desc')
      })

      expect(result.current.sortTodos).not.toBe(firstSortTodos)
    })
  })

  describe('localStorage persistence', () => {
    it('persists both sortBy and sortDirection together', () => {
      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortBy('alpha')
        result.current.setSortDirection('desc')
      })

      const stored = JSON.parse(localStorage.getItem('todo-sorting'))
      expect(stored).toEqual({ sortBy: 'alpha', sortDirection: 'desc' })
    })

    it('restores state after remount', () => {
      const { result, unmount } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortBy('priority')
        result.current.setSortDirection('desc')
      })

      unmount()

      const { result: newResult } = renderHook(() => useSorting())

      expect(newResult.current.sortBy).toBe('priority')
      expect(newResult.current.sortDirection).toBe('desc')
    })

    it('handles localStorage errors gracefully', () => {
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Storage full')
      })

      const { result } = renderHook(() => useSorting())

      act(() => {
        result.current.setSortBy('date')
      })

      expect(result.current.sortBy).toBe('date')

      Storage.prototype.setItem = originalSetItem
    })
  })
})
