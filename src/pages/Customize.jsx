import React from 'react'
import { motion } from 'framer-motion'
import AvatarScene from '../components/AvatarScene'
import ThemeToggle from '../components/ThemeToggle'
import EnvironmentSelector from '../components/EnvironmentSelector'
import '../styles/Customize.css'

const Customize = () => {
  return (
    <div className="customize-page">
      <motion.div
        className="customize-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="neon-cyan">Customize Your Avatar</h1>
        <p>Adjust appearance, environment, and settings</p>
      </motion.div>

      <div className="customize-layout">
        <motion.div
          className="preview-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AvatarScene enableControls={true} />
        </motion.div>

        <motion.div
          className="customize-panel glass"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="customize-section">
            <h2>Theme</h2>
            <ThemeToggle />
          </div>

          <div className="customize-section">
            <h2>Environment</h2>
            <EnvironmentSelector />
          </div>

          <div className="customize-section">
            <h2>Appearance</h2>
            <p className="coming-soon">More customization options coming soon...</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Customize


