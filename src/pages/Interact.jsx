import React from 'react'
import { motion } from 'framer-motion'
import AvatarScene from '../components/AvatarScene'
import ChatUI from '../components/ChatUI'
import VoiceControls from '../components/VoiceControls'
import ExpressionMenu from '../components/ExpressionMenu'
import GestureMenu from '../components/GestureMenu'
import HUDOverlay from '../components/HUDOverlay'
import '../styles/Interact.css'

const Interact = () => {
  return (
    <div className="interact-page">
      <HUDOverlay />
      
      <div className="interact-layout">
        <motion.div
          className="avatar-container"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AvatarScene enableControls={true} />
        </motion.div>

        <motion.div
          className="controls-panel glass"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ChatUI />
          <VoiceControls />
          
          <div className="menu-section">
            <ExpressionMenu />
            <GestureMenu />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Interact


