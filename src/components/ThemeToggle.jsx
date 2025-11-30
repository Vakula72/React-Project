import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import '../styles/ThemeToggle.css'

const ThemeToggle = () => {
  const { theme, setTheme } = useStore()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="theme-toggle">
      <button
        className={`toggle-btn ${theme}`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <motion.div
          className="toggle-slider"
          animate={{
            x: theme === 'dark' ? 0 : 24
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        <span className="toggle-icon">🌙</span>
        <span className="toggle-icon">☀️</span>
      </button>
      <span className="theme-label">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
    </div>
  )
}

export default ThemeToggle


