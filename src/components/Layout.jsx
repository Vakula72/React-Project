import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import ThemeToggle from './ThemeToggle'
import '../styles/Layout.css'

const Layout = ({ children }) => {
  const location = useLocation()
  const { theme } = useStore()

  // Apply theme to body element
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme'
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/interact', label: 'Interact' },
    { path: '/customize', label: 'Customize' }
  ]

  return (
    <div className="layout">
      <nav className="navbar glass-strong">
        <motion.div 
          className="nav-brand"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="neon-cyan">AI Avatar</h1>
        </motion.div>
        
        <ul className="nav-links">
          {navItems.map((item, index) => (
            <motion.li
              key={item.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        <ThemeToggle />
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout

