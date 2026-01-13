import { useState, useCallback, useMemo } from 'react'

/**
 * Custom hook for managing multi-select state
 * @returns {Object} selection state and helper functions
 */
export function useSelection() {
  const [selectedIds, setSelectedIds] = useState(new Set())

  /**
   * Toggle selection of a single item
   * @param {string} id - The ID to toggle
   */
  const toggleSelection = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  /**
   * Select all items from a list of IDs
   * @param {Array<string>} ids - Array of IDs to select
   */
  const selectAll = useCallback((ids) => {
    setSelectedIds(new Set(ids))
  }, [])

  /**
   * Clear all selections
   */
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  /**
   * Check if an item is selected
   * @param {string} id - The ID to check
   * @returns {boolean} Whether the item is selected
   */
  const isSelected = useCallback((id) => {
    return selectedIds.has(id)
  }, [selectedIds])

  /**
   * Get the count of selected items
   */
  const selectionCount = useMemo(() => selectedIds.size, [selectedIds])

  return {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectionCount,
  }
}
