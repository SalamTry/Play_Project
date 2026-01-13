import { useState, useEffect } from 'react'
import { useTodos } from './hooks/useTodos'
import { useFilter } from './hooks/useFilter'
import { useTheme } from './hooks/useTheme'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { EditTodoForm } from './components/EditTodoForm'
import { FilterBar } from './components/FilterBar'
import { SearchBar } from './components/SearchBar'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodo } = useTodos()
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

  // Apply dark class to html element based on theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const filteredTodos = filterTodos(todos)

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-3 sm:py-8 sm:px-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
              Todo App
            </h1>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Stay organized, get things done
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
          <TodoForm onAddTodo={addTodo} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 space-y-4 transition-colors">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
          />
        </div>

        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-gray-400 dark:text-gray-500 mb-3">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {todos.length === 0
                ? 'No todos yet. Add one above to get started!'
                : 'No todos match the current filters.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-2 sm:space-y-3" role="list" aria-label="Todo list">
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                {editingId === todo.id ? (
                  <EditTodoForm
                    todo={todo}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <TodoItem
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={handleEdit}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
