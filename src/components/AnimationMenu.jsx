import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import '../styles/AnimationMenu.css'

const animations = [
  { id: 'Idle', label: 'Idle', icon: '🧘' },
  { id: 'Wave', label: 'Wave', icon: '👋' },
  { id: 'Walk', label: 'Walk', icon: '🚶' },
  { id: 'Run', label: 'Run', icon: '🏃' },
  { id: 'Jump', label: 'Jump', icon: '🦘' },
  { id: 'Dance', label: 'Dance', icon: '💃' },
  { id: 'Talk', label: 'Talk', icon: '💬' },
  { id: 'Sit', label: 'Sit', icon: '🪑' },
]

const AnimationMenu = () => {
  const { currentAnimation, setCurrentAnimation } = useStore()

  return (
    <div className="animation-menu glass">
      <h3 className="neon-cyan">Animations</h3>
      <div className="animation-grid">
        {animations.map((anim) => (
          <motion.button
            key={anim.id}
            className={`animation-btn ${currentAnimation === anim.id ? 'active' : ''}`}
            onClick={() => setCurrentAnimation(anim.id)}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="animation-icon">{anim.icon}</span>
            <span className="animation-label">{anim.label}</span>
            {currentAnimation === anim.id && (
              <motion.div
                className="animation-indicator"
                layoutId="animationIndicator"
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

export default AnimationMenu

