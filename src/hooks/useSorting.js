import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'todo-sorting'

/**
 * Load sorting preferences from localStorage
 * @returns {Object} Sorting preferences with sortBy and sortDirection
 */
function loadSortingPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) {
      return { sortBy: 'custom', sortDirection: 'asc' }
    }
    const parsed = JSON.parse(stored)
    const validSortBy = ['custom', 'date', 'priority', 'alpha']
    const validSortDirection = ['asc', 'desc']
    return {
      sortBy: validSortBy.includes(parsed.sortBy) ? parsed.sortBy : 'custom',
      sortDirection: validSortDirection.includes(parsed.sortDirection)
        ? parsed.sortDirection
        : 'asc',
    }
  } catch {
    return { sortBy: 'custom', sortDirection: 'asc' }
  }
}

/**
 * Save sorting preferences to localStorage
 * @param {string} sortBy - Sort criteria
 * @param {string} sortDirection - Sort direction
 */
function saveSortingPreferences(sortBy, sortDirection) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sortBy, sortDirection }))
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Priority order mapping for sorting
 */
const PRIORITY_ORDER = {
  high: 3,
  medium: 2,
  low: 1,
  null: 0,
}

/**
 * Custom hook for managing todo sorting with localStorage persistence
 * @returns {Object} sorting state and functions
 */
export function useSorting() {
  const [{ sortBy, sortDirection }, setPreferences] = useState(() => loadSortingPreferences())

  // Persist to localStorage whenever preferences change
  useEffect(() => {
    saveSortingPreferences(sortBy, sortDirection)
  }, [sortBy, sortDirection])

  /**
   * Set sort criteria
   * @param {string} value - 'custom' | 'date' | 'priority' | 'alpha'
   */
  const setSortBy = useCallback((value) => {
    setPreferences((prev) => ({ ...prev, sortBy: value }))
  }, [])

  /**
   * Set sort direction
   * @param {string} value - 'asc' | 'desc'
   */
  const setSortDirection = useCallback((value) => {
    setPreferences((prev) => ({ ...prev, sortDirection: value }))
  }, [])

  /**
   * Sort todos array based on current sort criteria and direction
   * @param {Array} todos - Array of todo objects
   * @returns {Array} Sorted todos array
   */
  const sortTodos = useCallback(
    (todos) => {
      if (!todos || todos.length === 0) {
        return todos
      }

      const sorted = [...todos]
      const multiplier = sortDirection === 'asc' ? 1 : -1

      switch (sortBy) {
        case 'custom':
          sorted.sort((a, b) => {
            const orderA = a.order ?? 0
            const orderB = b.order ?? 0
            return (orderA - orderB) * multiplier
          })
          break

        case 'date':
          sorted.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return (dateA - dateB) * multiplier
          })
          break

        case 'priority':
          sorted.sort((a, b) => {
            const priorityA = PRIORITY_ORDER[a.priority] ?? PRIORITY_ORDER.null
            const priorityB = PRIORITY_ORDER[b.priority] ?? PRIORITY_ORDER.null
            return (priorityA - priorityB) * multiplier
          })
          break

        case 'alpha':
          sorted.sort((a, b) => {
            const titleA = (a.title || '').toLowerCase()
            const titleB = (b.title || '').toLowerCase()
            return titleA.localeCompare(titleB) * multiplier
          })
          break

        default:
          break
      }

      return sorted
    },
    [sortBy, sortDirection]
  )

  return {
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sortTodos,
  }
}
