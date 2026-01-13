import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  let mockMatchMedia

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear()

    // Mock matchMedia
    mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    window.matchMedia = mockMatchMedia
  })

  describe('initialization', () => {
    it('defaults to light theme when no preference', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('light')
      expect(result.current.isDark).toBe(false)
    })

    it('respects system dark mode preference on first load', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('dark')
      expect(result.current.isDark).toBe(true)
    })

    it('loads theme from localStorage', () => {
      localStorage.setItem('theme', 'dark')

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('dark')
      expect(result.current.isDark).toBe(true)
    })

    it('localStorage takes precedence over system preference', () => {
      localStorage.setItem('theme', 'light')
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('light')
    })

    it('ignores invalid localStorage values', () => {
      localStorage.setItem('theme', 'invalid')

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('light')
    })
  })

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('light')

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('dark')
      expect(result.current.isDark).toBe(true)
    })

    it('toggles from dark to light', () => {
      localStorage.setItem('theme', 'dark')
      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('dark')

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('light')
      expect(result.current.isDark).toBe(false)
    })

    it('toggles multiple times correctly', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.toggleTheme()
      })
      expect(result.current.theme).toBe('dark')

      act(() => {
        result.current.toggleTheme()
      })
      expect(result.current.theme).toBe('light')

      act(() => {
        result.current.toggleTheme()
      })
      expect(result.current.theme).toBe('dark')
    })

    it('returns stable toggleTheme function', () => {
      const { result, rerender } = renderHook(() => useTheme())

      const firstToggle = result.current.toggleTheme

      rerender()

      expect(result.current.toggleTheme).toBe(firstToggle)
    })
  })

  describe('isDark', () => {
    it('returns true when theme is dark', () => {
      localStorage.setItem('theme', 'dark')
      const { result } = renderHook(() => useTheme())

      expect(result.current.isDark).toBe(true)
    })

    it('returns false when theme is light', () => {
      localStorage.setItem('theme', 'light')
      const { result } = renderHook(() => useTheme())

      expect(result.current.isDark).toBe(false)
    })

    it('updates when theme toggles', () => {
      const { result } = renderHook(() => useTheme())

      expect(result.current.isDark).toBe(false)

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.isDark).toBe(true)
    })
  })

  describe('persistence', () => {
    it('saves theme to localStorage when changed', () => {
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.toggleTheme()
      })

      expect(localStorage.getItem('theme')).toBe('dark')
    })

    it('persists light theme', () => {
      localStorage.setItem('theme', 'dark')
      const { result } = renderHook(() => useTheme())

      act(() => {
        result.current.toggleTheme()
      })

      expect(localStorage.getItem('theme')).toBe('light')
    })

    it('saves initial theme to localStorage', () => {
      renderHook(() => useTheme())

      expect(localStorage.getItem('theme')).toBe('light')
    })
  })
})
