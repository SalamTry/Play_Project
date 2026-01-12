const STORAGE_KEY = 'todos'

/**
 * Save todos array to localStorage
 * @param {Array} todos - Array of todo objects
 */
export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error)
  }
}

/**
 * Load todos array from localStorage
 * @returns {Array} Array of todo objects, or empty array if none found
 */
export function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) {
      return []
    }
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error)
    return []
  }
}
