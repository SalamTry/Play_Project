import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('registers keydown event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      renderHook(() => useKeyboardShortcuts({}))

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })

    it('removes keydown event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const { unmount } = renderHook(() => useKeyboardShortcuts({}))
      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      )
    })

    it('works with no shortcuts provided', () => {
      expect(() => renderHook(() => useKeyboardShortcuts())).not.toThrow()
    })

    it('works with empty shortcuts object', () => {
      expect(() => renderHook(() => useKeyboardShortcuts({}))).not.toThrow()
    })
  })

  describe('Ctrl/Cmd modifier detection', () => {
    it('detects Ctrl key as modifier', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', { ctrlKey: true })
      expect(result.current.isModifierPressed(event)).toBe(true)
    })

    it('detects Meta (Cmd) key as modifier', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', { metaKey: true })
      expect(result.current.isModifierPressed(event)).toBe(true)
    })

    it('returns false when no modifier is pressed', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', {
        ctrlKey: false,
        metaKey: false,
      })
      expect(result.current.isModifierPressed(event)).toBe(false)
    })

    it('detects modifier when both Ctrl and Meta are pressed', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', {
        ctrlKey: true,
        metaKey: true,
      })
      expect(result.current.isModifierPressed(event)).toBe(true)
    })
  })

  describe('callback system', () => {
    it('calls callback when matching shortcut is pressed', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ 'ctrl+n': callback }))

      const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'n' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('passes event to callback', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ 'ctrl+n': callback }))

      const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'n' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledWith(expect.any(KeyboardEvent))
    })

    it('does not call callback for non-matching shortcuts', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ 'ctrl+n': callback }))

      const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 's' })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
    })

    it('handles multiple shortcuts', () => {
      const callbackN = vi.fn()
      const callbackS = vi.fn()
      renderHook(() =>
        useKeyboardShortcuts({ 'ctrl+n': callbackN, 'ctrl+s': callbackS })
      )

      document.dispatchEvent(
        new KeyboardEvent('keydown', { ctrlKey: true, key: 'n' })
      )
      document.dispatchEvent(
        new KeyboardEvent('keydown', { ctrlKey: true, key: 's' })
      )

      expect(callbackN).toHaveBeenCalledTimes(1)
      expect(callbackS).toHaveBeenCalledTimes(1)
    })

    it('handles Escape key shortcut', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ escape: callback }))

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles number key shortcuts', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()
      renderHook(() =>
        useKeyboardShortcuts({ 'ctrl+1': callback1, 'ctrl+2': callback2 })
      )

      document.dispatchEvent(
        new KeyboardEvent('keydown', { ctrlKey: true, key: '1' })
      )
      document.dispatchEvent(
        new KeyboardEvent('keydown', { ctrlKey: true, key: '2' })
      )

      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('handles Meta key (Cmd) for Mac users', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ 'ctrl+n': callback }))

      const event = new KeyboardEvent('keydown', { metaKey: true, key: 'n' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles shift modifier combination', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ 'ctrl+shift+n': callback }))

      const event = new KeyboardEvent('keydown', {
        ctrlKey: true,
        shiftKey: true,
        key: 'n',
      })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles simple key shortcuts without modifiers', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ '?': callback }))

      const event = new KeyboardEvent('keydown', { key: '?' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles Delete key shortcut', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ delete: callback }))

      const event = new KeyboardEvent('keydown', { key: 'Delete' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles Backspace key shortcut', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ backspace: callback }))

      const event = new KeyboardEvent('keydown', { key: 'Backspace' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('normalizes key names to lowercase', () => {
      const callback = vi.fn()
      renderHook(() => useKeyboardShortcuts({ 'ctrl+n': callback }))

      const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'N' })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('does not call callback when callback is not a function', () => {
      renderHook(() => useKeyboardShortcuts({ 'ctrl+n': 'not a function' }))

      expect(() => {
        document.dispatchEvent(
          new KeyboardEvent('keydown', { ctrlKey: true, key: 'n' })
        )
      }).not.toThrow()
    })
  })

  describe('cleanup on unmount', () => {
    it('stops listening to events after unmount', () => {
      const callback = vi.fn()
      const { unmount } = renderHook(() =>
        useKeyboardShortcuts({ 'ctrl+n': callback })
      )

      unmount()

      document.dispatchEvent(
        new KeyboardEvent('keydown', { ctrlKey: true, key: 'n' })
      )

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('shortcut updates', () => {
    it('responds to updated shortcuts', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      const { rerender } = renderHook(
        ({ shortcuts }) => useKeyboardShortcuts(shortcuts),
        { initialProps: { shortcuts: { 'ctrl+n': callback1 } } }
      )

      document.dispatchEvent(
        new KeyboardEvent('keydown', { ctrlKey: true, key: 'n' })
      )
      expect(callback1).toHaveBeenCalledTimes(1)

      rerender({ shortcuts: { 'ctrl+n': callback2 } })

      document.dispatchEvent(
        new KeyboardEvent('keydown', { ctrlKey: true, key: 'n' })
      )
      expect(callback2).toHaveBeenCalledTimes(1)
    })
  })

  describe('getKeyString', () => {
    it('returns correct key string for simple key', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', { key: 'a' })
      expect(result.current.getKeyString(event)).toBe('a')
    })

    it('returns correct key string for Ctrl+key', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'n' })
      expect(result.current.getKeyString(event)).toBe('ctrl+n')
    })

    it('returns correct key string for Shift+key', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', { shiftKey: true, key: 'a' })
      expect(result.current.getKeyString(event)).toBe('shift+a')
    })

    it('returns correct key string for Ctrl+Shift+key', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', {
        ctrlKey: true,
        shiftKey: true,
        key: 'n',
      })
      expect(result.current.getKeyString(event)).toBe('ctrl+shift+n')
    })

    it('normalizes space key to "space"', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', { key: ' ' })
      expect(result.current.getKeyString(event)).toBe('space')
    })

    it('handles Escape key', () => {
      const { result } = renderHook(() => useKeyboardShortcuts({}))

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      expect(result.current.getKeyString(event)).toBe('escape')
    })
  })
})
