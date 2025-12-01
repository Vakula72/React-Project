import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import '../styles/HUDOverlay.css'

const HUDOverlay = () => {
  const { currentAnimation, currentExpression, currentGesture, isListening, isTalking } = useStore()

  return (
    <div className="hud-overlay">
      {/* Top Status Bar */}
      <motion.div
        className="hud-status-bar glass"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hud-status-item">
          <span className="hud-label">Status:</span>
          <span className="hud-value neon-cyan">Active</span>
        </div>
        <div className="hud-status-item">
          <span className="hud-label">Animation:</span>
          <span className="hud-value">{currentAnimation || 'Idle'}</span>
        </div>
        {currentExpression && (
          <div className="hud-status-item">
            <span className="hud-label">Expression:</span>
            <span className="hud-value neon-pink">{currentExpression}</span>
          </div>
        )}
        {isListening && (
          <motion.div
            className="hud-status-item"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="hud-label">Voice:</span>
            <span className="hud-value neon-green">Listening...</span>
          </motion.div>
        )}
        {isTalking && (
          <motion.div
            className="hud-status-item"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <span className="hud-label">Status:</span>
            <span className="hud-value neon-pink">Talking...</span>
          </motion.div>
        )}
      </motion.div>

      {/* Corner Info Panels */}
      <motion.div
        className="hud-corner-panel top-left glass"
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="hud-panel-title">System Info</div>
        <div className="hud-panel-content">
          <div>FPS: <span className="neon-cyan">60</span></div>
          <div>Render: <span className="neon-cyan">WebGL</span></div>
        </div>
      </motion.div>

      {currentGesture && (
        <motion.div
          className="hud-corner-panel top-right glass"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="hud-panel-title neon-pink">Gesture Active</div>
          <div className="hud-panel-content">
            {currentGesture}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default HUDOverlay


