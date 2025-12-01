import React, { Suspense, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import { useStore } from '../store/useStore'
import DynamicAvatar from '../components/DynamicAvatar'
import FocusCamera from '../components/FocusCamera'
import ChatUI from '../components/ChatUI'
import VoiceControls from '../components/VoiceControls'
import ExpressionMenu from '../components/ExpressionMenu'
import GestureMenu from '../components/GestureMenu'
import AnimationMenu from '../components/AnimationMenu'
import HUDOverlay from '../components/HUDOverlay'
import '../styles/Interact.css'

const Interact = () => {
  const { theme, selectedEnvironment, uploadedAvatarUrl, focusMode, setFocusMode } = useStore()
  const env = selectedEnvironment || 'city'
  const modelUrl = uploadedAvatarUrl || '/models/avatar.glb'
  const canvasContainerRef = useRef(null)

  // Handle click outside avatar to exit focus mode
  const handleCanvasClick = (e) => {
    // Exit focus mode when clicking the container background
    if (focusMode && (e.target === canvasContainerRef.current || e.target.classList.contains('focus-overlay'))) {
      setFocusMode(false)
    }
  }

  return (
    <div className="interact-page">
      <HUDOverlay />
      
      <div className="interact-layout">
        <motion.div
          className={`avatar-container ${focusMode ? 'focus-mode' : ''}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div 
            ref={canvasContainerRef}
            className={`avatar-scene-container ${focusMode ? 'focus-mode' : ''}`}
            onClick={handleCanvasClick}
          >
            <Canvas
              shadows
              gl={{ 
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
              }}
              dpr={[1, 2]}
            >
              {/* Camera Setup - Optimized for better zoom */}
              <PerspectiveCamera
                makeDefault
                position={[0, 1.2, 3.5]}
                fov={55}
              />

              {/* Focus Camera Controller */}
              <FocusCamera />

              {/* Dynamic Lighting System */}
              <ambientLight intensity={0.4} />
              
              {/* Main Key Light */}
              <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                color={theme === 'dark' ? '#00ffff' : '#ffffff'}
                castShadow
              />
              
              {/* Fill Light */}
              <directionalLight
                position={[-5, 3, -5]}
                intensity={0.6}
                color={theme === 'dark' ? '#ff00ff' : '#ffffff'}
              />
              
              {/* Rim Light */}
              <pointLight
                position={[0, 2, -3]}
                intensity={0.8}
                color="#0080ff"
                distance={10}
              />
              
              {/* Glow Effect */}
              <pointLight
                position={[0, 1.5, 0]}
                intensity={1.5}
                color="#00ffff"
                distance={5}
              />

              {/* Environment */}
              <Suspense fallback={null}>
                <Environment preset={env} />
              </Suspense>

              {/* Ground Shadow */}
              <ContactShadows
                position={[0, -0.5, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4.5}
              />

              {/* Dynamic Avatar Model */}
              <Suspense fallback={null}>
                <DynamicAvatar modelUrl={modelUrl} />
              </Suspense>

              {/* Camera Controls - Disabled in focus mode */}
              <OrbitControls
                enablePan={!focusMode}
                enableZoom={!focusMode}
                enableRotate={!focusMode}
                minDistance={2}
                maxDistance={8}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.2}
                autoRotate={false}
                autoRotateSpeed={0.5}
                zoomSpeed={1.2}
                panSpeed={0.8}
              />
            </Canvas>
            
            {/* Focus Mode Overlay */}
            <AnimatePresence>
              {focusMode && (
                <motion.div
                  className="focus-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleCanvasClick}
                >
                  <div className="focus-hint" onClick={(e) => e.stopPropagation()}>
                    Click outside to exit focus mode
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            <AnimationMenu />
            <ExpressionMenu />
            <GestureMenu />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Interact


