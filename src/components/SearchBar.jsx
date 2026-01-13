import { useState, useEffect, useRef } from 'react'

/**
 * SearchBar component for searching todos
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Callback when search value changes (debounced)
 * @param {string} [props.placeholder] - Placeholder text
 */
export function SearchBar({ value, onChange, placeholder = 'Search todos...' }) {
  const [inputValue, setInputValue] = useState(value)
  const debounceRef = useRef(null)

  // Sync external value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Debounced onChange handler
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [inputValue, onChange, value])

  const handleChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleClear = () => {
    setInputValue('')
    onChange('')
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        aria-label="Search todos"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
