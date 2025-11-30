import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AvatarScene from '../components/AvatarScene'
import '../styles/Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="hero-title neon-cyan">
          AI-Powered 3D Avatar
        </h1>
        <p className="hero-subtitle">
          Experience the future of human-AI interaction
        </p>
      </motion.div>

      <motion.div
        className="avatar-preview"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <AvatarScene enableControls={true} />
      </motion.div>

      <motion.div
        className="cta-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link to="/interact" className="btn btn-primary">
          Start Interaction
        </Link>
        <Link to="/customize" className="btn btn-secondary">
          Customize Avatar
        </Link>
      </motion.div>
    </div>
  )
}

export default Home


