import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { EditTodoForm } from './components/EditTodoForm'

function App() {
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodo } = useTodos()
  const [editingId, setEditingId] = useState(null)

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-3 sm:py-8 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Todo App
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Stay organized, get things done
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <TodoForm onAddTodo={addTodo} />
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-gray-400 mb-3">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">No todos yet. Add one above to get started!</p>
          </div>
        ) : (
          <ul className="space-y-2 sm:space-y-3" role="list" aria-label="Todo list">
            {todos.map((todo) => (
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
