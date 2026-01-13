import { useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for handling global keyboard shortcuts
 * @param {Object} shortcuts - Map of key combinations to callback functions
 * @returns {Object} Functions to manage keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts = {}) {
  const shortcutsRef = useRef(shortcuts)

  // Keep the ref updated with latest shortcuts
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  /**
   * Detect if Ctrl (Windows/Linux) or Cmd (Mac) is pressed
   * @param {KeyboardEvent} event
   * @returns {boolean}
   */
  const isModifierPressed = useCallback((event) => {
    return event.ctrlKey || event.metaKey
  }, [])

  /**
   * Build a key string from a keyboard event
   * @param {KeyboardEvent} event
   * @returns {string} Key string like "ctrl+n" or "escape"
   */
  const getKeyString = useCallback(
    (event) => {
      const parts = []

      if (isModifierPressed(event)) {
        parts.push('ctrl')
      }

      if (event.shiftKey) {
        parts.push('shift')
      }

      if (event.altKey) {
        parts.push('alt')
      }

      // Normalize key names
      let key = event.key.toLowerCase()

      // Handle special keys
      if (key === ' ') {
        key = 'space'
      }

      // Don't add modifier keys themselves to the key part
      if (!['control', 'meta', 'shift', 'alt'].includes(key)) {
        parts.push(key)
      }

      return parts.join('+')
    },
    [isModifierPressed]
  )

  /**
   * Handle keydown events
   */
  const handleKeyDown = useCallback(
    (event) => {
      const keyString = getKeyString(event)
      const callback = shortcutsRef.current[keyString]

      if (callback && typeof callback === 'function') {
        // Prevent default browser behavior for matched shortcuts
        event.preventDefault()
        callback(event)
      }
    },
    [getKeyString]
  )

  // Register and cleanup keydown event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    isModifierPressed,
    getKeyString,
  }
}
