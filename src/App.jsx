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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Todo App
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <TodoForm onAddTodo={addTodo} />
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No todos yet. Add one above to get started!</p>
          </div>
        ) : (
          <ul className="space-y-2" role="list" aria-label="Todo list">
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
