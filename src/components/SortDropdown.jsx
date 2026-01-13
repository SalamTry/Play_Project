import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Sort option configuration
 */
const SORT_OPTIONS = [
  { value: 'custom', label: 'Custom Order', icon: 'grip' },
  { value: 'date', label: 'Date Created', icon: 'calendar' },
  { value: 'priority', label: 'Priority', icon: 'flag' },
  { value: 'alpha', label: 'Alphabetical', icon: 'alpha' },
]

/**
 * Icon component for sort options
 */
function SortIcon({ type, className = '' }) {
  const iconClass = `w-4 h-4 ${className}`

  switch (type) {
    case 'grip':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'calendar':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'flag':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.948 7.948 0 005.965.524l2.078-.64A.75.75 0 0018 12.25v-8.5a.75.75 0 00-.904-.734l-2.38.501a7.25 7.25 0 01-4.186-.363l-.502-.2a8.75 8.75 0 00-5.053-.439l-1.475.31V2.75z" />
        </svg>
      )
    case 'alpha':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.068 2.485c.714.436 1.599-.207 1.405-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
            clipRule="evenodd"
          />
        </svg>
      )
    default:
      return null
  }
}

/**
 * Direction toggle icon
 */
function DirectionIcon({ direction, className = '' }) {
  const iconClass = `w-4 h-4 transition-transform ${direction === 'desc' ? 'rotate-180' : ''} ${className}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={iconClass}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/**
 * SortDropdown component for selecting sort option and direction
 * @param {Object} props
 * @param {string} props.sortBy - Current sort criteria ('custom' | 'date' | 'priority' | 'alpha')
 * @param {Function} props.onSortByChange - Callback when sort criteria changes
 * @param {string} props.sortDirection - Current sort direction ('asc' | 'desc')
 * @param {Function} props.onSortDirectionChange - Callback when direction changes
 */
export function SortDropdown({
  sortBy = 'custom',
  onSortByChange,
  sortDirection = 'asc',
  onSortDirectionChange,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === sortBy) || SORT_OPTIONS[0]

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }, [])

  const handleEscape = useCallback((event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false)
      buttonRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleClickOutside, handleEscape])

  function handleSelect(value) {
    onSortByChange(value)
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  function handleToggleDirection() {
    onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        return
      }
      const currentIndex = SORT_OPTIONS.findIndex((opt) => opt.value === sortBy)
      const nextIndex =
        event.key === 'ArrowDown'
          ? (currentIndex + 1) % SORT_OPTIONS.length
          : (currentIndex - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length
      onSortByChange(SORT_OPTIONS[nextIndex].value)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Sort:
      </span>

      <div ref={dropdownRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Sort by ${currentOption.label}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
        >
          <SortIcon type={currentOption.icon} />
          <span>{currentOption.label}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <ul
            role="listbox"
            aria-label="Sort options"
            className="absolute z-10 mt-1 w-full min-w-[160px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg py-1 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            {SORT_OPTIONS.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={sortBy === option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                  sortBy === option.value
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                }`}
              >
                <SortIcon type={option.icon} />
                <span>{option.label}</span>
                {sortBy === option.value && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 ml-auto"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={handleToggleDirection}
        aria-label={`Sort direction: ${sortDirection === 'asc' ? 'ascending' : 'descending'}. Click to toggle.`}
        title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        className="inline-flex items-center justify-center w-8 h-8 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all hover:scale-105 active:scale-95"
      >
        <DirectionIcon direction={sortDirection} />
      </button>
    </div>
  )
}
