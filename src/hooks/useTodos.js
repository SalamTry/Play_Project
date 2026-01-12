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
   * @returns {Object} The created todo
   */
  function addTodo(title, dueDate = null) {
    const newTodo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      dueDate,
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
   * Update a todo's title and/or due date
   * @param {string} id - The todo ID to update
   * @param {Object} updates - Object with title and/or dueDate
   */
  function updateTodo(id, updates) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              ...(updates.title !== undefined && { title: updates.title.trim() }),
              ...(updates.dueDate !== undefined && { dueDate: updates.dueDate }),
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
