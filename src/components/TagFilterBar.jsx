import { getTagColorStyle } from './TagInput'

/**
 * TagFilterBar component for filtering todos by tags
 * @param {Object} props
 * @param {Array} props.todos - Array of all todos to extract unique tags from
 * @param {Array} props.selectedTags - Array of selected tag IDs
 * @param {Function} props.onSelectedTagsChange - Callback when selected tags change
 */
export function TagFilterBar({ todos = [], selectedTags = [], onSelectedTagsChange }) {
  // Extract all unique tags from todos
  const uniqueTags = []
  const seenIds = new Set()

  for (const todo of todos) {
    for (const tag of todo.tags || []) {
      if (!seenIds.has(tag.id)) {
        seenIds.add(tag.id)
        uniqueTags.push(tag)
      }
    }
  }

  // Don't render anything if there are no tags
  if (uniqueTags.length === 0) {
    return null
  }

  function handleTagClick(tagId) {
    if (selectedTags.includes(tagId)) {
      onSelectedTagsChange(selectedTags.filter((id) => id !== tagId))
    } else {
      onSelectedTagsChange([...selectedTags, tagId])
    }
  }

  function handleClearAll() {
    onSelectedTagsChange([])
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tags">
      {uniqueTags.map((tag) => {
        const colorStyle = getTagColorStyle(tag.color)
        const isSelected = selectedTags.includes(tag.id)

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleTagClick(tag.id)}
            aria-pressed={isSelected}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800 ${colorStyle.bg} ${colorStyle.text} ${
              isSelected
                ? 'ring-2 ring-offset-1 ring-slate-400 dark:ring-offset-slate-800'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            {tag.name}
          </button>
        )
      })}

      {selectedTags.length > 0 && (
        <button
          type="button"
          onClick={handleClearAll}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
          Clear filters
        </button>
      )}
    </div>
  )
}
