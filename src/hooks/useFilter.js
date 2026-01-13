import { useState, useCallback } from 'react'

/**
 * Custom hook for filtering and searching todos
 * @returns {Object} filter state and functions
 */
export function useFilter() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * Filter todos by status and search query
   * @param {Array} todos - Array of todo objects
   * @returns {Array} Filtered todos
   */
  const filterTodos = useCallback(
    (todos) => {
      let result = todos

      // Filter by status
      if (filter === 'active') {
        result = result.filter((todo) => !todo.completed)
      } else if (filter === 'completed') {
        result = result.filter((todo) => todo.completed)
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        result = result.filter((todo) =>
          todo.title.toLowerCase().includes(query)
        )
      }

      return result
    },
    [filter, searchQuery]
  )

  return {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filterTodos,
  }
}
