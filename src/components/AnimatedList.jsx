import { AnimatePresence, motion } from 'framer-motion'

/**
 * AnimatedList wrapper component using Framer Motion
 * Provides smooth animations for list items (add/remove/reorder)
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 */
export function AnimatedList({ children }) {
  return (
    <AnimatePresence mode="popLayout">
      {children}
    </AnimatePresence>
  )
}

/**
 * AnimatedItem wrapper for individual list items
 * @param {Object} props
 * @param {string|number} props.itemKey - Unique key for animation tracking
 * @param {React.ReactNode} props.children - Content to wrap
 * @param {string} props.className - Optional additional class names
 */
export function AnimatedItem({ itemKey, children, className = '' }) {
  return (
    <motion.div
      key={itemKey}
      layout
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        layout: { type: 'spring', stiffness: 300, damping: 30 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
