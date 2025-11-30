import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import '../styles/ExpressionMenu.css'

const expressions = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'surprised', label: 'Surprised', emoji: '😲' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
  { id: 'excited', label: 'Excited', emoji: '🤩' }
]

const ExpressionMenu = () => {
  const { currentExpression, setCurrentExpression } = useStore()

  return (
    <div className="expression-menu glass">
      <h3 className="neon-cyan">Expressions</h3>
      <div className="expression-grid">
        {expressions.map((expr) => (
          <motion.button
            key={expr.id}
            className={`expression-btn ${currentExpression === expr.id ? 'active' : ''}`}
            onClick={() => setCurrentExpression(expr.id)}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="expression-emoji">{expr.emoji}</span>
            <span className="expression-label">{expr.label}</span>
            {currentExpression === expr.id && (
              <motion.div
                className="expression-indicator"
                layoutId="expressionIndicator"
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

export default ExpressionMenu


