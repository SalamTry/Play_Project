import { useState, useEffect } from 'react'
import { saveTodos, loadTodos } from '../utils/storage'

/**
 * Custom hook for managing todos with localStorage persistence
 * @returns {Object} todos state and CRUD functions
 */
export function useTodos() {
  const [todos, setTodos] = useState(() => loadTodos())

  // Save to localStorage whenever todos change
  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  /**
   * Add a new todo
   * @param {string} title - The todo title
   * @param {string|null} dueDate - Optional due date as ISO string
   * @param {string|null} priority - Optional priority ('high' | 'medium' | 'low' | null)
   * @param {Array|null} tags - Optional array of tag objects with id, name, color
   * @returns {Object} The created todo
   */
  function addTodo(title, dueDate = null, priority = null, tags = []) {
    const newTodo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      dueDate,
      priority,
      tags: tags || [],
      createdAt: new Date().toISOString(),
    }
    setTodos((prev) => [...prev, newTodo])
    return newTodo
  }

  /**
   * Delete a todo by ID
   * @param {string} id - The todo ID to delete
   */
  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  /**
   * Toggle the completed status of a todo
   * @param {string} id - The todo ID to toggle
   */
  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  /**
   * Update a todo's title, due date, priority, and/or tags
   * @param {string} id - The todo ID to update
   * @param {Object} updates - Object with title, dueDate, priority, and/or tags
   */
  function updateTodo(id, updates) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              ...(updates.title !== undefined && { title: updates.title.trim() }),
              ...(updates.dueDate !== undefined && { dueDate: updates.dueDate }),
              ...(updates.priority !== undefined && { priority: updates.priority }),
              ...(updates.tags !== undefined && { tags: updates.tags }),
            }
          : todo
      )
    )
  }

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
  }
}
