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
   * @param {Array|null} subtasks - Optional array of subtask objects with id, text, completed
   * @returns {Object} The created todo
   */
  function addTodo(title, dueDate = null, priority = null, tags = [], subtasks = []) {
    let newTodo
    setTodos((prev) => {
      const maxOrder = prev.reduce((max, todo) => Math.max(max, todo.order ?? 0), 0)
      newTodo = {
        id: crypto.randomUUID(),
        title: title.trim(),
        completed: false,
        dueDate,
        priority,
        tags: tags || [],
        subtasks: subtasks || [],
        createdAt: new Date().toISOString(),
        order: maxOrder + 1,
      }
      return [...prev, newTodo]
    })
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
   * Update a todo's title, due date, priority, tags, and/or subtasks
   * @param {string} id - The todo ID to update
   * @param {Object} updates - Object with title, dueDate, priority, tags, and/or subtasks
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
              ...(updates.subtasks !== undefined && { subtasks: updates.subtasks }),
            }
          : todo
      )
    )
  }

  /**
   * Add a subtask to a todo
   * @param {string} todoId - The todo ID to add subtask to
   * @param {string} text - The subtask text
   * @returns {Object|null} The created subtask or null if todo not found
   */
  function addSubtask(todoId, text) {
    const newSubtask = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
    }
    let created = null
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === todoId) {
          created = newSubtask
          return {
            ...todo,
            subtasks: [...(todo.subtasks || []), newSubtask],
          }
        }
        return todo
      })
    )
    return created
  }

  /**
   * Update a subtask
   * @param {string} todoId - The todo ID containing the subtask
   * @param {string} subtaskId - The subtask ID to update
   * @param {Object} updates - Object with text and/or completed
   */
  function updateSubtask(todoId, subtaskId, updates) {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: (todo.subtasks || []).map((subtask) =>
              subtask.id === subtaskId
                ? {
                    ...subtask,
                    ...(updates.text !== undefined && { text: updates.text.trim() }),
                    ...(updates.completed !== undefined && { completed: updates.completed }),
                  }
                : subtask
            ),
          }
        }
        return todo
      })
    )
  }

  /**
   * Delete a subtask from a todo
   * @param {string} todoId - The todo ID containing the subtask
   * @param {string} subtaskId - The subtask ID to delete
   */
  function deleteSubtask(todoId, subtaskId) {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: (todo.subtasks || []).filter((subtask) => subtask.id !== subtaskId),
          }
        }
        return todo
      })
    )
  }

  /**
   * Reorder todos by updating their order values
   * @param {string} activeId - The ID of the todo being moved
   * @param {string} overId - The ID of the todo it's being dropped on
   */
  function reorderTodos(activeId, overId) {
    setTodos((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === activeId)
      const newIndex = prev.findIndex((t) => t.id === overId)

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prev
      }

      // Create a new array with the item moved
      const result = [...prev]
      const [removed] = result.splice(oldIndex, 1)
      result.splice(newIndex, 0, removed)

      // Update order values based on new positions
      return result.map((todo, index) => ({
        ...todo,
        order: index + 1,
      }))
    })
  }

  /**
   * Mark multiple todos as completed
   * @param {Array<string>} ids - Array of todo IDs to mark as completed
   */
  function bulkComplete(ids) {
    const idSet = new Set(ids)
    setTodos((prev) =>
      prev.map((todo) =>
        idSet.has(todo.id) ? { ...todo, completed: true } : todo
      )
    )
  }

  /**
   * Delete multiple todos
   * @param {Array<string>} ids - Array of todo IDs to delete
   */
  function bulkDelete(ids) {
    const idSet = new Set(ids)
    setTodos((prev) => prev.filter((todo) => !idSet.has(todo.id)))
  }

  /**
   * Set priority for multiple todos
   * @param {Array<string>} ids - Array of todo IDs to update
   * @param {string|null} priority - Priority to set ('high' | 'medium' | 'low' | null)
   */
  function bulkSetPriority(ids, priority) {
    const idSet = new Set(ids)
    setTodos((prev) =>
      prev.map((todo) =>
        idSet.has(todo.id) ? { ...todo, priority } : todo
      )
    )
  }

  /**
   * Add a tag to multiple todos
   * @param {Array<string>} ids - Array of todo IDs to update
   * @param {Object} tag - Tag object with id, name, color properties
   */
  function bulkAddTag(ids, tag) {
    const idSet = new Set(ids)
    setTodos((prev) =>
      prev.map((todo) => {
        if (!idSet.has(todo.id)) return todo
        const existingTags = todo.tags || []
        // Avoid duplicate tags
        if (existingTags.some((t) => t.id === tag.id)) return todo
        return { ...todo, tags: [...existingTags, tag] }
      })
    )
  }

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    reorderTodos,
    bulkComplete,
    bulkDelete,
    bulkSetPriority,
    bulkAddTag,
  }
}
