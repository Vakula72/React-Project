import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import '../styles/ChatUI.css'

const ChatUI = () => {
  const { chatMessages, addChatMessage, setCurrentExpression, setCurrentGesture } = useStore()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    addChatMessage(userMessage)

    // Simulate AI response with avatar reactions
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: generateResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      }
      addChatMessage(aiMessage)
      
      // Trigger avatar reaction based on message
      triggerAvatarReaction(inputValue)
    }, 1000)

    setInputValue('')
  }

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! I'm your AI avatar. How can I help you today?"
    } else if (lowerInput.includes('happy') || lowerInput.includes('excited')) {
      return "That's wonderful! I'm excited too!"
    } else if (lowerInput.includes('sad') || lowerInput.includes('upset')) {
      return "I'm sorry to hear that. I'm here to help!"
    } else if (lowerInput.includes('wave') || lowerInput.includes('hello')) {
      return "👋 Hello there!"
    } else {
      return "I understand. Tell me more about that."
    }
  }

  const triggerAvatarReaction = (input) => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('happy') || lowerInput.includes('excited')) {
      setCurrentExpression('happy')
      setCurrentGesture('wave')
    } else if (lowerInput.includes('sad')) {
      setCurrentExpression('sad')
    } else if (lowerInput.includes('wave')) {
      setCurrentGesture('wave')
    } else if (lowerInput.includes('nod') || lowerInput.includes('yes')) {
      setCurrentGesture('nod')
    } else if (lowerInput.includes('shake') || lowerInput.includes('no')) {
      setCurrentGesture('shake')
    }
  }

  return (
    <div className="chat-ui glass">
      <div className="chat-header">
        <h3 className="neon-cyan">Chat with Avatar</h3>
      </div>

      <div className="chat-messages">
        <AnimatePresence>
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.sender}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="chat-send-btn">
          <span>→</span>
        </button>
      </form>
    </div>
  )
}

export default ChatUI


