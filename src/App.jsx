import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useTodos } from './hooks/useTodos'
import { useFilter } from './hooks/useFilter'
import { useTheme } from './hooks/useTheme'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { EditTodoForm } from './components/EditTodoForm'
import { FilterBar } from './components/FilterBar'
import { SearchBar } from './components/SearchBar'
import { ThemeToggle } from './components/ThemeToggle'
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function App() {
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodo, reorderTodos } = useTodos()
  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    filterTodos,
  } = useFilter()
  const { isDark, toggleTheme } = useTheme()
  const [editingId, setEditingId] = useState(null)
  const [selectedTodoId, setSelectedTodoId] = useState(null)
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false)

  const todoFormRef = useRef(null)
  const searchBarRef = useRef(null)

  // Configure dnd-kit sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Drag end handler - reorders todos when dropped
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      reorderTodos(active.id, over.id)
    }
  }, [reorderTodos])

  // Apply dark class to html element based on theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const filteredTodos = filterTodos(todos)

  // Keyboard shortcut handlers
  const focusNewTodo = useCallback(() => {
    todoFormRef.current?.focus()
  }, [])

  const focusSearch = useCallback(() => {
    searchBarRef.current?.focus()
  }, [])

  const switchToAllFilter = useCallback(() => {
    setFilter('all')
  }, [setFilter])

  const switchToActiveFilter = useCallback(() => {
    setFilter('active')
  }, [setFilter])

  const switchToCompletedFilter = useCallback(() => {
    setFilter('completed')
  }, [setFilter])

  const handleEscape = useCallback(() => {
    if (isShortcutsHelpOpen) {
      setIsShortcutsHelpOpen(false)
    } else {
      setEditingId(null)
      setSelectedTodoId(null)
    }
  }, [isShortcutsHelpOpen])

  const openShortcutsHelp = useCallback(() => {
    setIsShortcutsHelpOpen(true)
  }, [])

  const deleteSelectedTodo = useCallback(() => {
    if (selectedTodoId && !editingId) {
      deleteTodo(selectedTodoId)
      setSelectedTodoId(null)
    }
  }, [selectedTodoId, editingId, deleteTodo])

  const shortcuts = useMemo(
    () => ({
      'ctrl+n': focusNewTodo,
      'ctrl+f': focusSearch,
      'ctrl+1': switchToAllFilter,
      'ctrl+2': switchToActiveFilter,
      'ctrl+3': switchToCompletedFilter,
      escape: handleEscape,
      delete: deleteSelectedTodo,
      backspace: deleteSelectedTodo,
      'shift+?': openShortcutsHelp,
    }),
    [
      focusNewTodo,
      focusSearch,
      switchToAllFilter,
      switchToActiveFilter,
      switchToCompletedFilter,
      handleEscape,
      deleteSelectedTodo,
      openShortcutsHelp,
    ]
  )

  useKeyboardShortcuts(shortcuts)

  function handleEdit(id) {
    setEditingId(id)
  }

  function handleSave(id, updates) {
    updateTodo(id, updates)
    setEditingId(null)
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 py-6 px-3 sm:py-8 sm:px-4 transition-colors">
        <div className="max-w-2xl mx-auto">
          <header className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10" />
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent text-center">
                Todo App
              </h1>
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-medium">
              Stay organized, get things done
            </p>
          </header>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
            <TodoForm ref={todoFormRef} onAddTodo={addTodo} />
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6 mb-4 sm:mb-6 space-y-4 transition-colors">
            <SearchBar ref={searchBarRef} value={searchQuery} onChange={setSearchQuery} />
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
            />
          </div>

          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-slate-300 dark:text-slate-600 mb-3">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">
                {todos.length === 0
                  ? 'No todos yet. Add one above to get started!'
                  : 'No todos match the current filters.'}
              </p>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={handleEdit}
              selectedTodoId={selectedTodoId}
              onSelect={setSelectedTodoId}
              editingId={editingId}
              onSave={handleSave}
              onCancelEdit={handleCancelEdit}
              EditTodoForm={EditTodoForm}
            />
          )}
        </div>

        <KeyboardShortcutsHelp
          isOpen={isShortcutsHelpOpen}
          onClose={() => setIsShortcutsHelpOpen(false)}
        />
      </div>
    </DndContext>
  )
}

export default App
