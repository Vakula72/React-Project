import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AvatarCartoonScene from '../components/AvatarCartoonScene'
import { useStore } from '../store/useStore'
import '../styles/Home.css'

const Home = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [isScrolling, setIsScrolling] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const { setUploadedAvatarUrl } = useStore()

  // Track scroll position with throttling
  useEffect(() => {
    let scrollTimeout = null
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          setIsScrolling(true)
          
          // Clear existing timeout
          if (scrollTimeout) {
            clearTimeout(scrollTimeout)
          }
          
          // Set scrolling to false after scroll stops
          scrollTimeout = setTimeout(() => {
            setIsScrolling(false)
          }, 150)
          
          ticking = false
        })
        ticking = true
      }
    }

    // Set initial scroll position
    setScrollY(window.scrollY)
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validExtensions = ['.glb', '.gltf']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!validExtensions.includes(fileExtension)) {
      setUploadError('Please upload a valid 3D model (.glb or .gltf)')
      setTimeout(() => setUploadError(null), 3000)
      return
    }

    setIsUploading(true)
    setUploadError(null)

    // Create blob URL
    const blobUrl = URL.createObjectURL(file)
    
    // Store in Zustand
    setUploadedAvatarUrl(blobUrl)
    
    // Navigate to interact page
    setTimeout(() => {
      setIsUploading(false)
      navigate('/interact')
    }, 500)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="home-page">
      <motion.div
        className="hero-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="hero-title">3D Avatar Builder</h1>
        <p className="hero-subtitle">Create and interact with your personalized 3D character</p>
      </motion.div>

      <div className="avatar-canvas-container">
        <AvatarCartoonScene 
          scrollY={scrollY}
          isScrolling={isScrolling}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
        />
      </div>

      {/* Upload Avatar Section */}
      <motion.div
        className="upload-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        <motion.button
          className="upload-button"
          onClick={handleUploadClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <span className="upload-spinner"></span>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Upload Your Avatar</span>
            </>
          )}
        </motion.button>

        {uploadError && (
          <motion.div
            className="upload-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {uploadError}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Home
