import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import '../styles/VoiceControls.css'

const VoiceControls = () => {
  const { isListening, setIsListening } = useStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false)
      setIsProcessing(false)
    } else {
      // Start listening
      setIsListening(true)
      
      // Simulate voice recognition
      setTimeout(() => {
        setIsProcessing(true)
        // Simulate processing
        setTimeout(() => {
          setIsProcessing(false)
          setIsListening(false)
        }, 2000)
      }, 500)
    }
  }

  return (
    <div className="voice-controls glass">
      <h3 className="neon-cyan">Voice Control</h3>
      
      <div className="voice-control-container">
        <motion.button
          className={`voice-btn ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
          onClick={toggleListening}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isListening
              ? [
                  '0 0 20px rgba(0, 255, 255, 0.5)',
                  '0 0 40px rgba(0, 255, 255, 0.8)',
                  '0 0 20px rgba(0, 255, 255, 0.5)'
                ]
              : '0 0 10px rgba(0, 255, 255, 0.3)'
          }}
          transition={{
            boxShadow: {
              duration: 1.5,
              repeat: isListening ? Infinity : 0
            }
          }}
        >
          <motion.div
            className="voice-icon"
            animate={{
              scale: isListening ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: isListening ? Infinity : 0
            }}
          >
            {isProcessing ? '⚡' : isListening ? '🎤' : '🎙️'}
          </motion.div>
          <span>
            {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Start Voice'}
          </span>
        </motion.button>

        {isListening && (
          <motion.div
            className="voice-waves"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="wave-bar"
                animate={{
                  height: [10, 30, 10],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <p className="voice-hint">
        {isListening 
          ? 'Speak now...' 
          : 'Click to activate voice commands'}
      </p>
    </div>
  )
}

export default VoiceControls


