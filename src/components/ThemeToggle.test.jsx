import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  describe('rendering', () => {
    it('renders a button', () => {
      render(<ThemeToggle isDark={false} onToggle={() => {}} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders sun and moon icons', () => {
      render(<ThemeToggle isDark={false} onToggle={() => {}} />)

      const svgs = screen.getByRole('button').querySelectorAll('svg')
      expect(svgs).toHaveLength(2)
    })
  })

  describe('accessibility', () => {
    it('has aria-label for light mode when in dark mode', () => {
      render(<ThemeToggle isDark={true} onToggle={() => {}} />)

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to light mode'
      )
    })

    it('has aria-label for dark mode when in light mode', () => {
      render(<ThemeToggle isDark={false} onToggle={() => {}} />)

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to dark mode'
      )
    })

    it('has aria-hidden on icons', () => {
      render(<ThemeToggle isDark={false} onToggle={() => {}} />)

      const svgs = screen.getByRole('button').querySelectorAll('svg')
      svgs.forEach((svg) => {
        expect(svg).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('interactions', () => {
    it('calls onToggle when clicked', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      render(<ThemeToggle isDark={false} onToggle={onToggle} />)

      await user.click(screen.getByRole('button'))

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('calls onToggle multiple times on multiple clicks', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()
      render(<ThemeToggle isDark={false} onToggle={onToggle} />)

      await user.click(screen.getByRole('button'))
      await user.click(screen.getByRole('button'))
      await user.click(screen.getByRole('button'))

      expect(onToggle).toHaveBeenCalledTimes(3)
    })
  })

  describe('icon transitions', () => {
    it('shows sun icon visible and moon icon hidden in light mode', () => {
      render(<ThemeToggle isDark={false} onToggle={() => {}} />)

      const svgs = screen.getByRole('button').querySelectorAll('svg')
      const sunIcon = svgs[0]
      const moonIcon = svgs[1]

      expect(sunIcon.getAttribute('class')).toContain('opacity-100')
      expect(moonIcon.getAttribute('class')).toContain('opacity-0')
    })

    it('shows moon icon visible and sun icon hidden in dark mode', () => {
      render(<ThemeToggle isDark={true} onToggle={() => {}} />)

      const svgs = screen.getByRole('button').querySelectorAll('svg')
      const sunIcon = svgs[0]
      const moonIcon = svgs[1]

      expect(sunIcon.getAttribute('class')).toContain('opacity-0')
      expect(moonIcon.getAttribute('class')).toContain('opacity-100')
    })
  })
})
