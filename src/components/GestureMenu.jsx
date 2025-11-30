import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import '../styles/GestureMenu.css'

const gestures = [
  { id: 'wave', label: 'Wave', emoji: '👋' },
  { id: 'nod', label: 'Nod', emoji: '👍' },
  { id: 'shake', label: 'Shake Head', emoji: '👎' },
  { id: 'point', label: 'Point', emoji: '👉' },
  { id: 'clap', label: 'Clap', emoji: '👏' },
  { id: 'thumbsup', label: 'Thumbs Up', emoji: '👍' }
]

const GestureMenu = () => {
  const { currentGesture, setCurrentGesture } = useStore()

  const handleGestureClick = (gestureId) => {
    setCurrentGesture(gestureId)
    
    // Reset gesture after animation completes
    setTimeout(() => {
      setCurrentGesture(null)
    }, 3000)
  }

  return (
    <div className="gesture-menu glass">
      <h3 className="neon-cyan">Gestures</h3>
      <div className="gesture-grid">
        {gestures.map((gesture) => (
          <motion.button
            key={gesture.id}
            className={`gesture-btn ${currentGesture === gesture.id ? 'active' : ''}`}
            onClick={() => handleGestureClick(gesture.id)}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="gesture-emoji">{gesture.emoji}</span>
            <span className="gesture-label">{gesture.label}</span>
            {currentGesture === gesture.id && (
              <motion.div
                className="gesture-indicator"
                layoutId="gestureIndicator"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default GestureMenu


