import { useState } from 'react'

/**
 * Predefined colors for tags
 */
const TAG_COLORS = [
  { name: 'red', bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-300', swatch: 'bg-red-500' },
  { name: 'orange', bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-700 dark:text-orange-300', swatch: 'bg-orange-500' },
  { name: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-700 dark:text-yellow-300', swatch: 'bg-yellow-500' },
  { name: 'green', bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', swatch: 'bg-emerald-500' },
  { name: 'blue', bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-700 dark:text-blue-300', swatch: 'bg-blue-500' },
  { name: 'indigo', bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-700 dark:text-indigo-300', swatch: 'bg-indigo-500' },
  { name: 'purple', bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-700 dark:text-purple-300', swatch: 'bg-purple-500' },
  { name: 'pink', bg: 'bg-pink-100 dark:bg-pink-900/50', text: 'text-pink-700 dark:text-pink-300', swatch: 'bg-pink-500' },
]

/**
 * Get color style by color name
 * @param {string} colorName
 * @returns {Object}
 */
export function getTagColorStyle(colorName) {
  return TAG_COLORS.find((c) => c.name === colorName) || TAG_COLORS[0]
}

/**
 * Component for adding and removing tags
 * @param {Object} props
 * @param {Array} props.tags - Current array of tags
 * @param {Function} props.onChange - Callback when tags change
 */
export function TagInput({ tags = [], onChange }) {
  const [tagName, setTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState('blue')

  function handleAddTag() {
    const trimmedName = tagName.trim()
    if (!trimmedName) return

    const newTag = {
      id: crypto.randomUUID(),
      name: trimmedName,
      color: selectedColor,
    }

    onChange([...tags, newTag])
    setTagName('')
  }

  function handleRemoveTag(tagId) {
    onChange(tags.filter((tag) => tag.id !== tagId))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="space-y-3">
      {/* Tag input row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tag name"
          aria-label="Tag name"
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all bg-white dark:bg-slate-700 dark:text-white"
        />

        {/* Color picker */}
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Tag color">
          {TAG_COLORS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColor(color.name)}
              aria-label={`${color.name} color`}
              aria-checked={selectedColor === color.name}
              role="radio"
              className={`w-6 h-6 rounded-full ${color.swatch} transition-all hover:scale-110 active:scale-95 ${
                selectedColor === color.name
                  ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-800'
                  : ''
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddTag}
          className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 active:scale-95 transition-all"
        >
          Add Tag
        </button>
      </div>

      {/* Tag pills */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Tags">
          {tags.map((tag) => {
            const colorStyle = getTagColorStyle(tag.color)
            return (
              <span
                key={tag.id}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${colorStyle.bg} ${colorStyle.text}`}
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  aria-label={`Remove ${tag.name} tag`}
                  className="ml-0.5 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-current transition-all"
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
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
