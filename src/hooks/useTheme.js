import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Custom hook for managing theme with localStorage persistence
 * @returns {Object} theme state and toggle function
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
    // Respect system preference on first load
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  // Save to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const isDark = theme === 'dark'

  return {
    theme,
    toggleTheme,
    isDark,
  }
}
