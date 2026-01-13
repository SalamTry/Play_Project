import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSelection } from './useSelection'

describe('useSelection', () => {
  describe('initialization', () => {
    it('initializes with empty selectedIds Set', () => {
      const { result } = renderHook(() => useSelection())

      expect(result.current.selectedIds).toBeInstanceOf(Set)
      expect(result.current.selectedIds.size).toBe(0)
    })

    it('initializes with selectionCount of 0', () => {
      const { result } = renderHook(() => useSelection())

      expect(result.current.selectionCount).toBe(0)
    })
  })

  describe('toggleSelection', () => {
    it('adds ID to selection when not selected', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.toggleSelection('item-1')
      })

      expect(result.current.selectedIds.has('item-1')).toBe(true)
      expect(result.current.selectionCount).toBe(1)
    })

    it('removes ID from selection when already selected', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.toggleSelection('item-1')
      })

      act(() => {
        result.current.toggleSelection('item-1')
      })

      expect(result.current.selectedIds.has('item-1')).toBe(false)
      expect(result.current.selectionCount).toBe(0)
    })

    it('handles multiple toggles correctly', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.toggleSelection('item-1')
        result.current.toggleSelection('item-2')
        result.current.toggleSelection('item-3')
      })

      expect(result.current.selectionCount).toBe(3)

      act(() => {
        result.current.toggleSelection('item-2')
      })

      expect(result.current.selectionCount).toBe(2)
      expect(result.current.selectedIds.has('item-1')).toBe(true)
      expect(result.current.selectedIds.has('item-2')).toBe(false)
      expect(result.current.selectedIds.has('item-3')).toBe(true)
    })
  })

  describe('selectAll', () => {
    it('selects all provided IDs', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.selectAll(['item-1', 'item-2', 'item-3'])
      })

      expect(result.current.selectionCount).toBe(3)
      expect(result.current.selectedIds.has('item-1')).toBe(true)
      expect(result.current.selectedIds.has('item-2')).toBe(true)
      expect(result.current.selectedIds.has('item-3')).toBe(true)
    })

    it('replaces previous selection', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.selectAll(['item-1', 'item-2'])
      })

      act(() => {
        result.current.selectAll(['item-3', 'item-4'])
      })

      expect(result.current.selectionCount).toBe(2)
      expect(result.current.selectedIds.has('item-1')).toBe(false)
      expect(result.current.selectedIds.has('item-2')).toBe(false)
      expect(result.current.selectedIds.has('item-3')).toBe(true)
      expect(result.current.selectedIds.has('item-4')).toBe(true)
    })

    it('handles empty array', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.selectAll(['item-1'])
      })

      act(() => {
        result.current.selectAll([])
      })

      expect(result.current.selectionCount).toBe(0)
    })
  })

  describe('clearSelection', () => {
    it('clears all selected IDs', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.selectAll(['item-1', 'item-2', 'item-3'])
      })

      act(() => {
        result.current.clearSelection()
      })

      expect(result.current.selectionCount).toBe(0)
      expect(result.current.selectedIds.size).toBe(0)
    })

    it('is safe to call when already empty', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.clearSelection()
      })

      expect(result.current.selectionCount).toBe(0)
    })
  })

  describe('isSelected', () => {
    it('returns true for selected IDs', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.toggleSelection('item-1')
      })

      expect(result.current.isSelected('item-1')).toBe(true)
    })

    it('returns false for unselected IDs', () => {
      const { result } = renderHook(() => useSelection())

      expect(result.current.isSelected('item-1')).toBe(false)
    })

    it('returns false after deselection', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.toggleSelection('item-1')
      })

      act(() => {
        result.current.toggleSelection('item-1')
      })

      expect(result.current.isSelected('item-1')).toBe(false)
    })

    it('correctly checks multiple items', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.selectAll(['item-1', 'item-3'])
      })

      expect(result.current.isSelected('item-1')).toBe(true)
      expect(result.current.isSelected('item-2')).toBe(false)
      expect(result.current.isSelected('item-3')).toBe(true)
    })
  })

  describe('selectionCount', () => {
    it('returns 0 initially', () => {
      const { result } = renderHook(() => useSelection())

      expect(result.current.selectionCount).toBe(0)
    })

    it('updates when items are selected', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.toggleSelection('item-1')
      })

      expect(result.current.selectionCount).toBe(1)

      act(() => {
        result.current.toggleSelection('item-2')
      })

      expect(result.current.selectionCount).toBe(2)
    })

    it('updates when items are deselected', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.selectAll(['item-1', 'item-2', 'item-3'])
      })

      expect(result.current.selectionCount).toBe(3)

      act(() => {
        result.current.toggleSelection('item-2')
      })

      expect(result.current.selectionCount).toBe(2)
    })

    it('returns 0 after clearSelection', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.selectAll(['item-1', 'item-2'])
      })

      act(() => {
        result.current.clearSelection()
      })

      expect(result.current.selectionCount).toBe(0)
    })
  })

  describe('function stability', () => {
    it('toggleSelection maintains reference between renders', () => {
      const { result, rerender } = renderHook(() => useSelection())

      const firstToggle = result.current.toggleSelection

      rerender()

      expect(result.current.toggleSelection).toBe(firstToggle)
    })

    it('selectAll maintains reference between renders', () => {
      const { result, rerender } = renderHook(() => useSelection())

      const firstSelectAll = result.current.selectAll

      rerender()

      expect(result.current.selectAll).toBe(firstSelectAll)
    })

    it('clearSelection maintains reference between renders', () => {
      const { result, rerender } = renderHook(() => useSelection())

      const firstClear = result.current.clearSelection

      rerender()

      expect(result.current.clearSelection).toBe(firstClear)
    })
  })

  describe('edge cases', () => {
    it('handles undefined ID gracefully', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.toggleSelection(undefined)
      })

      expect(result.current.selectedIds.has(undefined)).toBe(true)
      expect(result.current.selectionCount).toBe(1)
    })

    it('handles numeric IDs', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.toggleSelection(123)
      })

      expect(result.current.isSelected(123)).toBe(true)
    })

    it('handles special characters in IDs', () => {
      const { result } = renderHook(() => useSelection())

      act(() => {
        result.current.toggleSelection('item-with-special-chars-!@#$%')
      })

      expect(result.current.isSelected('item-with-special-chars-!@#$%')).toBe(true)
    })

    it('handles large number of selections', () => {
      const { result } = renderHook(() => useSelection())

      const ids = Array.from({ length: 1000 }, (_, i) => `item-${i}`)

      act(() => {
        result.current.selectAll(ids)
      })

      expect(result.current.selectionCount).toBe(1000)
      expect(result.current.isSelected('item-500')).toBe(true)
    })
  })
})
