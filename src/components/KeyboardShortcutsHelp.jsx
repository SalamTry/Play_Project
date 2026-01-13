import { useEffect, useRef, useCallback } from 'react'

const SHORTCUTS = [
  { keys: ['Ctrl', 'N'], description: 'Focus new todo input' },
  { keys: ['Ctrl', 'F'], description: 'Focus search input' },
  { keys: ['Ctrl', '1'], description: 'Show all todos' },
  { keys: ['Ctrl', '2'], description: 'Show active todos' },
  { keys: ['Ctrl', '3'], description: 'Show completed todos' },
  { keys: ['Escape'], description: 'Close modal / Clear selection' },
  { keys: ['Delete'], description: 'Delete selected todo' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
]

/**
 * Modal component displaying all keyboard shortcuts
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 */
export function KeyboardShortcutsHelp({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previousActiveElement = useRef(null)

  // Store the previously focused element and focus the close button when opening
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement
      closeButtonRef.current?.focus()
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus()
      previousActiveElement.current = null
    }
  }, [isOpen])

  // Handle escape key and focus trap
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
        return
      }

      // Focus trap: keep focus within the modal
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    },
    [onClose]
  )

  // Handle click outside
  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2
            id="shortcuts-modal-title"
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            Keyboard Shortcuts
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close keyboard shortcuts"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <ul className="space-y-3" role="list">
            {SHORTCUTS.map((shortcut, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {shortcut.description}
                </span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex}>
                      <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-600 shadow-sm">
                        {key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && (
                        <span className="text-slate-400 dark:text-slate-500 mx-0.5">
                          +
                        </span>
                      )}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            On Mac, use <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">Cmd</kbd> instead of <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600">Ctrl</kbd>
          </p>
        </div>
      </div>
    </div>
  )
}
