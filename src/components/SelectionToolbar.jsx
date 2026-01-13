import { useMemo } from 'react'

/**
 * SelectionToolbar component - Shows bulk action buttons when items are selected
 * @param {Object} props
 * @param {number} props.selectionCount - Number of selected items
 * @param {Function} props.onCompleteAll - Callback to mark all selected items as complete
 * @param {Function} props.onDeleteAll - Callback to delete all selected items
 * @param {Function} props.onClearSelection - Callback to clear selection
 */
export function SelectionToolbar({
  selectionCount = 0,
  onCompleteAll,
  onDeleteAll,
  onClearSelection,
}) {
  const isVisible = selectionCount > 0

  const selectionText = useMemo(() => {
    return selectionCount === 1 ? '1 item selected' : `${selectionCount} items selected`
  }, [selectionCount])

  if (!isVisible) {
    return null
  }

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions toolbar"
      className="fixed top-0 left-0 right-0 z-40 bg-indigo-600 dark:bg-indigo-700 text-white shadow-lg transform transition-transform duration-300 ease-out animate-slide-down"
    >
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <span className="text-sm font-medium" aria-live="polite">
          {selectionText}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCompleteAll}
            className="px-3 py-1.5 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
            aria-label="Mark all selected items as complete"
          >
            Complete All
          </button>

          <button
            type="button"
            onClick={onDeleteAll}
            className="px-3 py-1.5 text-sm font-medium bg-red-500 hover:bg-red-600 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
            aria-label="Delete all selected items"
          >
            Delete All
          </button>

          <button
            type="button"
            onClick={onClearSelection}
            className="px-3 py-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
            aria-label="Clear selection"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  )
}
