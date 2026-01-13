import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from './useTodos'

// Mock the storage module
vi.mock('../utils/storage', () => ({
  saveTodos: vi.fn(),
  loadTodos: vi.fn(() => []),
}))

import { saveTodos, loadTodos } from '../utils/storage'

describe('useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    loadTodos.mockReturnValue([])
  })

  describe('initialization', () => {
    it('loads todos from storage on mount', () => {
      const storedTodos = [
        { id: '1', title: 'Stored todo', completed: false },
      ]
      loadTodos.mockReturnValue(storedTodos)

      const { result } = renderHook(() => useTodos())

      expect(loadTodos).toHaveBeenCalled()
      expect(result.current.todos).toEqual(storedTodos)
    })

    it('starts with empty array if no stored todos', () => {
      loadTodos.mockReturnValue([])

      const { result } = renderHook(() => useTodos())

      expect(result.current.todos).toEqual([])
    })
  })

  describe('addTodo', () => {
    it('adds a new todo with required fields', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('New todo')
      })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0]).toMatchObject({
        title: 'New todo',
        completed: false,
        dueDate: null,
        priority: null,
      })
      expect(result.current.todos[0].id).toBeDefined()
      expect(result.current.todos[0].createdAt).toBeDefined()
    })

    it('adds a todo with due date', () => {
      const { result } = renderHook(() => useTodos())
      const dueDate = '2024-12-31T00:00:00.000Z'

      act(() => {
        result.current.addTodo('Todo with date', dueDate)
      })

      expect(result.current.todos[0].dueDate).toBe(dueDate)
    })

    it('adds a todo with priority', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('High priority todo', null, 'high')
      })

      expect(result.current.todos[0].priority).toBe('high')
    })

    it('adds a todo with due date and priority', () => {
      const { result } = renderHook(() => useTodos())
      const dueDate = '2024-12-31T00:00:00.000Z'

      act(() => {
        result.current.addTodo('Full todo', dueDate, 'medium')
      })

      expect(result.current.todos[0]).toMatchObject({
        title: 'Full todo',
        dueDate,
        priority: 'medium',
      })
    })

    it('trims whitespace from title', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('  Trimmed title  ')
      })

      expect(result.current.todos[0].title).toBe('Trimmed title')
    })

    it('adds a todo with tags', () => {
      const { result } = renderHook(() => useTodos())
      const tags = [
        { id: 'tag-1', name: 'Work', color: '#ff0000' },
        { id: 'tag-2', name: 'Urgent', color: '#00ff00' },
      ]

      act(() => {
        result.current.addTodo('Todo with tags', null, null, tags)
      })

      expect(result.current.todos[0].tags).toEqual(tags)
    })

    it('defaults tags to empty array when not provided', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Todo without tags')
      })

      expect(result.current.todos[0].tags).toEqual([])
    })

    it('adds a todo with all fields including tags', () => {
      const { result } = renderHook(() => useTodos())
      const dueDate = '2024-12-31T00:00:00.000Z'
      const tags = [{ id: 'tag-1', name: 'Personal', color: '#0000ff' }]

      act(() => {
        result.current.addTodo('Full todo with tags', dueDate, 'high', tags)
      })

      expect(result.current.todos[0]).toMatchObject({
        title: 'Full todo with tags',
        dueDate,
        priority: 'high',
        tags,
      })
    })

    it('returns the created todo', () => {
      const { result } = renderHook(() => useTodos())
      let createdTodo

      act(() => {
        createdTodo = result.current.addTodo('New todo')
      })

      expect(createdTodo).toMatchObject({
        title: 'New todo',
        completed: false,
      })
      expect(createdTodo.id).toBeDefined()
    })

    it('returns the created todo with order field', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 5 },
      ])

      const { result } = renderHook(() => useTodos())
      let createdTodo

      act(() => {
        createdTodo = result.current.addTodo('New todo')
      })

      expect(createdTodo.order).toBe(6)
    })
  })

  describe('deleteTodo', () => {
    it('removes a todo by ID', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.deleteTodo('1')
      })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].id).toBe('2')
    })

    it('does nothing if ID not found', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.deleteTodo('nonexistent')
      })

      expect(result.current.todos).toHaveLength(1)
    })
  })

  describe('toggleTodo', () => {
    it('toggles completed status from false to true', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.toggleTodo('1')
      })

      expect(result.current.todos[0].completed).toBe(true)
    })

    it('toggles completed status from true to false', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: true },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.toggleTodo('1')
      })

      expect(result.current.todos[0].completed).toBe(false)
    })

    it('only toggles the specified todo', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false },
        { id: '2', title: 'Todo 2', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.toggleTodo('1')
      })

      expect(result.current.todos[0].completed).toBe(true)
      expect(result.current.todos[1].completed).toBe(false)
    })
  })

  describe('updateTodo', () => {
    it('updates the title of a todo', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Old title', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { title: 'New title' })
      })

      expect(result.current.todos[0].title).toBe('New title')
    })

    it('updates the due date of a todo', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, dueDate: null },
      ])

      const { result } = renderHook(() => useTodos())
      const newDueDate = '2024-12-31T00:00:00.000Z'

      act(() => {
        result.current.updateTodo('1', { dueDate: newDueDate })
      })

      expect(result.current.todos[0].dueDate).toBe(newDueDate)
    })

    it('updates both title and due date', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Old', completed: false, dueDate: null },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', {
          title: 'New',
          dueDate: '2024-12-31T00:00:00.000Z',
        })
      })

      expect(result.current.todos[0].title).toBe('New')
      expect(result.current.todos[0].dueDate).toBe('2024-12-31T00:00:00.000Z')
    })

    it('trims whitespace from updated title', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Old', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { title: '  Trimmed  ' })
      })

      expect(result.current.todos[0].title).toBe('Trimmed')
    })

    it('clears due date when set to null', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, dueDate: '2024-12-31' },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { dueDate: null })
      })

      expect(result.current.todos[0].dueDate).toBeNull()
    })

    it('updates the priority of a todo', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, priority: null },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { priority: 'high' })
      })

      expect(result.current.todos[0].priority).toBe('high')
    })

    it('clears priority when set to null', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, priority: 'high' },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { priority: null })
      })

      expect(result.current.todos[0].priority).toBeNull()
    })

    it('updates title, due date, and priority together', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Old', completed: false, dueDate: null, priority: null },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', {
          title: 'New',
          dueDate: '2024-12-31T00:00:00.000Z',
          priority: 'low',
        })
      })

      expect(result.current.todos[0]).toMatchObject({
        title: 'New',
        dueDate: '2024-12-31T00:00:00.000Z',
        priority: 'low',
      })
    })

    it('preserves other fields when updating', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: true, dueDate: '2024-12-31', priority: 'high', createdAt: '2024-01-01' },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { title: 'Updated' })
      })

      expect(result.current.todos[0]).toMatchObject({
        id: '1',
        completed: true,
        dueDate: '2024-12-31',
        priority: 'high',
        createdAt: '2024-01-01',
      })
    })

    it('updates the tags of a todo', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, tags: [] },
      ])

      const { result } = renderHook(() => useTodos())
      const newTags = [
        { id: 'tag-1', name: 'Work', color: '#ff0000' },
        { id: 'tag-2', name: 'Urgent', color: '#00ff00' },
      ]

      act(() => {
        result.current.updateTodo('1', { tags: newTags })
      })

      expect(result.current.todos[0].tags).toEqual(newTags)
    })

    it('replaces existing tags', () => {
      const oldTags = [{ id: 'tag-1', name: 'Old', color: '#000000' }]
      const newTags = [{ id: 'tag-2', name: 'New', color: '#ffffff' }]
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, tags: oldTags },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { tags: newTags })
      })

      expect(result.current.todos[0].tags).toEqual(newTags)
    })

    it('clears tags when set to empty array', () => {
      const tags = [{ id: 'tag-1', name: 'Work', color: '#ff0000' }]
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, tags },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { tags: [] })
      })

      expect(result.current.todos[0].tags).toEqual([])
    })

    it('updates title, due date, priority, and tags together', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Old', completed: false, dueDate: null, priority: null, tags: [] },
      ])

      const { result } = renderHook(() => useTodos())
      const tags = [{ id: 'tag-1', name: 'Important', color: '#ff0000' }]

      act(() => {
        result.current.updateTodo('1', {
          title: 'New',
          dueDate: '2024-12-31T00:00:00.000Z',
          priority: 'high',
          tags,
        })
      })

      expect(result.current.todos[0]).toMatchObject({
        title: 'New',
        dueDate: '2024-12-31T00:00:00.000Z',
        priority: 'high',
        tags,
      })
    })

    it('preserves tags when updating other fields', () => {
      const tags = [{ id: 'tag-1', name: 'Work', color: '#ff0000' }]
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, tags },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { title: 'Updated' })
      })

      expect(result.current.todos[0].tags).toEqual(tags)
    })
  })

  describe('addTodo with subtasks', () => {
    it('adds a todo with subtasks', () => {
      const { result } = renderHook(() => useTodos())
      const subtasks = [
        { id: 'st-1', text: 'Subtask 1', completed: false },
        { id: 'st-2', text: 'Subtask 2', completed: true },
      ]

      act(() => {
        result.current.addTodo('Todo with subtasks', null, null, [], subtasks)
      })

      expect(result.current.todos[0].subtasks).toEqual(subtasks)
    })

    it('defaults subtasks to empty array when not provided', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Todo without subtasks')
      })

      expect(result.current.todos[0].subtasks).toEqual([])
    })

    it('adds a todo with all fields including subtasks', () => {
      const { result } = renderHook(() => useTodos())
      const dueDate = '2024-12-31T00:00:00.000Z'
      const tags = [{ id: 'tag-1', name: 'Work', color: '#ff0000' }]
      const subtasks = [{ id: 'st-1', text: 'Step 1', completed: false }]

      act(() => {
        result.current.addTodo('Full todo', dueDate, 'high', tags, subtasks)
      })

      expect(result.current.todos[0]).toMatchObject({
        title: 'Full todo',
        dueDate,
        priority: 'high',
        tags,
        subtasks,
      })
    })
  })

  describe('addSubtask', () => {
    it('adds a subtask to a todo', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, subtasks: [] },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addSubtask('1', 'New subtask')
      })

      expect(result.current.todos[0].subtasks).toHaveLength(1)
      expect(result.current.todos[0].subtasks[0]).toMatchObject({
        text: 'New subtask',
        completed: false,
      })
      expect(result.current.todos[0].subtasks[0].id).toBeDefined()
    })

    it('returns the created subtask', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, subtasks: [] },
      ])

      const { result } = renderHook(() => useTodos())
      let createdSubtask

      act(() => {
        createdSubtask = result.current.addSubtask('1', 'New subtask')
      })

      expect(createdSubtask).toMatchObject({
        text: 'New subtask',
        completed: false,
      })
      expect(createdSubtask.id).toBeDefined()
    })

    it('trims whitespace from subtask text', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, subtasks: [] },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addSubtask('1', '  Trimmed subtask  ')
      })

      expect(result.current.todos[0].subtasks[0].text).toBe('Trimmed subtask')
    })

    it('adds multiple subtasks to a todo', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, subtasks: [] },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addSubtask('1', 'First subtask')
        result.current.addSubtask('1', 'Second subtask')
      })

      expect(result.current.todos[0].subtasks).toHaveLength(2)
      expect(result.current.todos[0].subtasks[0].text).toBe('First subtask')
      expect(result.current.todos[0].subtasks[1].text).toBe('Second subtask')
    })

    it('handles adding subtask to todo without subtasks array', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addSubtask('1', 'New subtask')
      })

      expect(result.current.todos[0].subtasks).toHaveLength(1)
    })
  })

  describe('updateSubtask', () => {
    it('updates the text of a subtask', () => {
      loadTodos.mockReturnValue([
        {
          id: '1',
          title: 'Todo',
          completed: false,
          subtasks: [{ id: 'st-1', text: 'Old text', completed: false }],
        },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateSubtask('1', 'st-1', { text: 'New text' })
      })

      expect(result.current.todos[0].subtasks[0].text).toBe('New text')
    })

    it('updates the completed status of a subtask', () => {
      loadTodos.mockReturnValue([
        {
          id: '1',
          title: 'Todo',
          completed: false,
          subtasks: [{ id: 'st-1', text: 'Subtask', completed: false }],
        },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateSubtask('1', 'st-1', { completed: true })
      })

      expect(result.current.todos[0].subtasks[0].completed).toBe(true)
    })

    it('updates both text and completed status', () => {
      loadTodos.mockReturnValue([
        {
          id: '1',
          title: 'Todo',
          completed: false,
          subtasks: [{ id: 'st-1', text: 'Old', completed: false }],
        },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateSubtask('1', 'st-1', { text: 'New', completed: true })
      })

      expect(result.current.todos[0].subtasks[0]).toMatchObject({
        text: 'New',
        completed: true,
      })
    })

    it('trims whitespace from updated text', () => {
      loadTodos.mockReturnValue([
        {
          id: '1',
          title: 'Todo',
          completed: false,
          subtasks: [{ id: 'st-1', text: 'Old', completed: false }],
        },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateSubtask('1', 'st-1', { text: '  Trimmed  ' })
      })

      expect(result.current.todos[0].subtasks[0].text).toBe('Trimmed')
    })

    it('only updates the specified subtask', () => {
      loadTodos.mockReturnValue([
        {
          id: '1',
          title: 'Todo',
          completed: false,
          subtasks: [
            { id: 'st-1', text: 'First', completed: false },
            { id: 'st-2', text: 'Second', completed: false },
          ],
        },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateSubtask('1', 'st-1', { completed: true })
      })

      expect(result.current.todos[0].subtasks[0].completed).toBe(true)
      expect(result.current.todos[0].subtasks[1].completed).toBe(false)
    })
  })

  describe('deleteSubtask', () => {
    it('removes a subtask by ID', () => {
      loadTodos.mockReturnValue([
        {
          id: '1',
          title: 'Todo',
          completed: false,
          subtasks: [
            { id: 'st-1', text: 'First', completed: false },
            { id: 'st-2', text: 'Second', completed: false },
          ],
        },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.deleteSubtask('1', 'st-1')
      })

      expect(result.current.todos[0].subtasks).toHaveLength(1)
      expect(result.current.todos[0].subtasks[0].id).toBe('st-2')
    })

    it('does nothing if subtask ID not found', () => {
      loadTodos.mockReturnValue([
        {
          id: '1',
          title: 'Todo',
          completed: false,
          subtasks: [{ id: 'st-1', text: 'Subtask', completed: false }],
        },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.deleteSubtask('1', 'nonexistent')
      })

      expect(result.current.todos[0].subtasks).toHaveLength(1)
    })

    it('handles deleting from todo without subtasks array', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.deleteSubtask('1', 'st-1')
      })

      expect(result.current.todos[0].subtasks).toEqual([])
    })
  })

  describe('updateTodo with subtasks', () => {
    it('updates the subtasks of a todo', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, subtasks: [] },
      ])

      const { result } = renderHook(() => useTodos())
      const newSubtasks = [
        { id: 'st-1', text: 'New subtask', completed: false },
      ]

      act(() => {
        result.current.updateTodo('1', { subtasks: newSubtasks })
      })

      expect(result.current.todos[0].subtasks).toEqual(newSubtasks)
    })

    it('replaces existing subtasks', () => {
      const oldSubtasks = [{ id: 'st-1', text: 'Old', completed: false }]
      const newSubtasks = [{ id: 'st-2', text: 'New', completed: true }]
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, subtasks: oldSubtasks },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { subtasks: newSubtasks })
      })

      expect(result.current.todos[0].subtasks).toEqual(newSubtasks)
    })

    it('preserves subtasks when updating other fields', () => {
      const subtasks = [{ id: 'st-1', text: 'Subtask', completed: false }]
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false, subtasks },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.updateTodo('1', { title: 'Updated' })
      })

      expect(result.current.todos[0].subtasks).toEqual(subtasks)
    })
  })

  describe('order field', () => {
    it('new todo gets order = 1 when no existing todos', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('First todo')
      })

      expect(result.current.todos[0].order).toBe(1)
    })

    it('new todo gets order = max + 1 when todos exist', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 1 },
        { id: '2', title: 'Todo 2', completed: false, order: 2 },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('New todo')
      })

      expect(result.current.todos[2].order).toBe(3)
    })

    it('handles legacy todos without order field', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Legacy todo', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('New todo')
      })

      expect(result.current.todos[1].order).toBe(1)
    })

    it('new todo order handles non-sequential existing orders', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 5 },
        { id: '2', title: 'Todo 2', completed: false, order: 10 },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('New todo')
      })

      expect(result.current.todos[2].order).toBe(11)
    })
  })

  describe('reorderTodos', () => {
    it('moves todo from first to last position', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 1 },
        { id: '2', title: 'Todo 2', completed: false, order: 2 },
        { id: '3', title: 'Todo 3', completed: false, order: 3 },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.reorderTodos('1', '3')
      })

      expect(result.current.todos[0].id).toBe('2')
      expect(result.current.todos[1].id).toBe('3')
      expect(result.current.todos[2].id).toBe('1')
      expect(result.current.todos[0].order).toBe(1)
      expect(result.current.todos[1].order).toBe(2)
      expect(result.current.todos[2].order).toBe(3)
    })

    it('moves todo from last to first position', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 1 },
        { id: '2', title: 'Todo 2', completed: false, order: 2 },
        { id: '3', title: 'Todo 3', completed: false, order: 3 },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.reorderTodos('3', '1')
      })

      expect(result.current.todos[0].id).toBe('3')
      expect(result.current.todos[1].id).toBe('1')
      expect(result.current.todos[2].id).toBe('2')
      expect(result.current.todos[0].order).toBe(1)
      expect(result.current.todos[1].order).toBe(2)
      expect(result.current.todos[2].order).toBe(3)
    })

    it('moves todo to middle position', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 1 },
        { id: '2', title: 'Todo 2', completed: false, order: 2 },
        { id: '3', title: 'Todo 3', completed: false, order: 3 },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.reorderTodos('1', '2')
      })

      expect(result.current.todos[0].id).toBe('2')
      expect(result.current.todos[1].id).toBe('1')
      expect(result.current.todos[2].id).toBe('3')
    })

    it('does nothing when activeId not found', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 1 },
        { id: '2', title: 'Todo 2', completed: false, order: 2 },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.reorderTodos('nonexistent', '2')
      })

      expect(result.current.todos[0].id).toBe('1')
      expect(result.current.todos[1].id).toBe('2')
    })

    it('does nothing when overId not found', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 1 },
        { id: '2', title: 'Todo 2', completed: false, order: 2 },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.reorderTodos('1', 'nonexistent')
      })

      expect(result.current.todos[0].id).toBe('1')
      expect(result.current.todos[1].id).toBe('2')
    })

    it('does nothing when activeId equals overId', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 1 },
        { id: '2', title: 'Todo 2', completed: false, order: 2 },
      ])

      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.reorderTodos('1', '1')
      })

      expect(result.current.todos[0].id).toBe('1')
      expect(result.current.todos[1].id).toBe('2')
    })

    it('persists order changes to storage', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo 1', completed: false, order: 1 },
        { id: '2', title: 'Todo 2', completed: false, order: 2 },
      ])

      const { result } = renderHook(() => useTodos())
      saveTodos.mockClear()

      act(() => {
        result.current.reorderTodos('2', '1')
      })

      expect(saveTodos).toHaveBeenCalled()
      expect(saveTodos.mock.calls[0][0][0].id).toBe('2')
      expect(saveTodos.mock.calls[0][0][0].order).toBe(1)
    })
  })

  describe('persistence', () => {
    it('saves todos to storage when todos change', async () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('New todo')
      })

      // saveTodos is called in useEffect
      expect(saveTodos).toHaveBeenCalled()
    })

    it('saves after delete', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      // Clear the initial save call
      saveTodos.mockClear()

      act(() => {
        result.current.deleteTodo('1')
      })

      expect(saveTodos).toHaveBeenCalledWith([])
    })

    it('saves after toggle', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Todo', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      saveTodos.mockClear()

      act(() => {
        result.current.toggleTodo('1')
      })

      expect(saveTodos).toHaveBeenCalled()
      expect(saveTodos.mock.calls[0][0][0].completed).toBe(true)
    })

    it('saves after update', () => {
      loadTodos.mockReturnValue([
        { id: '1', title: 'Old', completed: false },
      ])

      const { result } = renderHook(() => useTodos())

      saveTodos.mockClear()

      act(() => {
        result.current.updateTodo('1', { title: 'New' })
      })

      expect(saveTodos).toHaveBeenCalled()
      expect(saveTodos.mock.calls[0][0][0].title).toBe('New')
    })
  })
})
