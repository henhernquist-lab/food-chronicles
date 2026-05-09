import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * PageIntro — full-screen black splash that fades out on first visit.
 * Skipped on subsequent navigations via sessionStorage.
 */
export default function PageIntro({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 600)
    }, 1800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="page-intro-overlay flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="masthead-title font-serif font-black tracking-tight"
            data-text="THE FOOD CHRONICLE"
            style={{ fontSize: 'clamp(2rem, 7vw, 5rem)', lineHeight: 1 }}
          >
            THE FOOD CHRONICLE
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            style={{
              height: 1,
              width: 'min(400px, 70%)',
              background: 'linear-gradient(90deg, transparent, #D4A853 30%, #FFD700 50%, #D4A853 70%, transparent)',
              transformOrigin: 'left',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
