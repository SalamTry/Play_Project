import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveTodos, loadTodos } from './storage'

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('saveTodos', () => {
    it('saves todos to localStorage', () => {
      const todos = [
        { id: '1', title: 'Test todo', completed: false },
        { id: '2', title: 'Another todo', completed: true },
      ]

      saveTodos(todos)

      const stored = localStorage.getItem('todos')
      expect(stored).toBe(JSON.stringify(todos))
    })

    it('saves empty array', () => {
      saveTodos([])

      const stored = localStorage.getItem('todos')
      expect(stored).toBe('[]')
    })

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      saveTodos([{ id: '1', title: 'Test' }])

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save todos to localStorage:',
        expect.any(Error)
      )
    })
  })

  describe('loadTodos', () => {
    it('loads todos from localStorage', () => {
      const todos = [
        { id: '1', title: 'Test todo', completed: false },
        { id: '2', title: 'Another todo', completed: true },
      ]
      localStorage.setItem('todos', JSON.stringify(todos))

      const result = loadTodos()

      expect(result).toEqual(todos)
    })

    it('returns empty array when no todos stored', () => {
      const result = loadTodos()

      expect(result).toEqual([])
    })

    it('returns empty array for invalid JSON', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      localStorage.setItem('todos', 'not valid json')

      const result = loadTodos()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('returns empty array if stored value is not an array', () => {
      localStorage.setItem('todos', JSON.stringify({ not: 'an array' }))

      const result = loadTodos()

      expect(result).toEqual([])
    })

    it('returns empty array if stored value is a string', () => {
      localStorage.setItem('todos', JSON.stringify('just a string'))

      const result = loadTodos()

      expect(result).toEqual([])
    })

    it('handles localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied')
      })

      const result = loadTodos()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load todos from localStorage:',
        expect.any(Error)
      )
    })
  })
})
