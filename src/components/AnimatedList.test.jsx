import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnimatedList, AnimatedItem } from './AnimatedList'

describe('AnimatedList', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(
        <AnimatedList>
          <div data-testid="child-1">Item 1</div>
          <div data-testid="child-2">Item 2</div>
        </AnimatedList>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })

    it('renders without children', () => {
      const { container } = render(<AnimatedList />)
      expect(container).toBeInTheDocument()
    })

    it('renders single child', () => {
      render(
        <AnimatedList>
          <div data-testid="single-child">Single Item</div>
        </AnimatedList>
      )

      expect(screen.getByTestId('single-child')).toBeInTheDocument()
    })
  })
})

describe('AnimatedItem', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(
        <AnimatedItem itemKey="test-1">
          <span>Animated content</span>
        </AnimatedItem>
      )

      expect(screen.getByText('Animated content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <AnimatedItem itemKey="test-2" className="custom-class">
          <span>Content</span>
        </AnimatedItem>
      )

      const animatedElement = screen.getByText('Content').parentElement
      expect(animatedElement).toHaveClass('custom-class')
    })

    it('renders without className', () => {
      render(
        <AnimatedItem itemKey="test-3">
          <span>Content</span>
        </AnimatedItem>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('renders multiple AnimatedItems', () => {
      render(
        <AnimatedList>
          <AnimatedItem itemKey="1">Item 1</AnimatedItem>
          <AnimatedItem itemKey="2">Item 2</AnimatedItem>
          <AnimatedItem itemKey="3">Item 3</AnimatedItem>
        </AnimatedList>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })
  })

  describe('integration', () => {
    it('works within AnimatedList', () => {
      render(
        <AnimatedList>
          <AnimatedItem itemKey="item-1">
            <div data-testid="animated-content">Animated!</div>
          </AnimatedItem>
        </AnimatedList>
      )

      expect(screen.getByTestId('animated-content')).toBeInTheDocument()
    })
  })
})
