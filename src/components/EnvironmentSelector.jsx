import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import '../styles/EnvironmentSelector.css'

const environments = [
  { id: 'city', label: 'City', icon: '🏙️' },
  { id: 'sunset', label: 'Sunset', icon: '🌅' },
  { id: 'night', label: 'Night', icon: '🌃' },
  { id: 'dawn', label: 'Dawn', icon: '🌄' },
  { id: 'warehouse', label: 'Warehouse', icon: '🏭' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
  { id: 'apartment', label: 'Apartment', icon: '🏠' },
  { id: 'studio', label: 'Studio', icon: '🎬' }
]

const EnvironmentSelector = () => {
  const { selectedEnvironment, setSelectedEnvironment } = useStore()

  return (
    <div className="environment-selector glass">
      <h3 className="neon-cyan">Environment</h3>
      <div className="environment-grid">
        {environments.map((env) => (
          <motion.button
            key={env.id}
            className={`env-btn ${selectedEnvironment === env.id ? 'active' : ''}`}
            onClick={() => setSelectedEnvironment(env.id)}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="env-icon">{env.icon}</span>
            <span className="env-label">{env.label}</span>
            {selectedEnvironment === env.id && (
              <motion.div
                className="env-indicator"
                layoutId="envIndicator"
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

export default EnvironmentSelector


