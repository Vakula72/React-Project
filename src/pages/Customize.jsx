import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import { useStore } from '../store/useStore'
import DynamicAvatar from '../components/DynamicAvatar'
import ThemeToggle from '../components/ThemeToggle'
import EnvironmentSelector from '../components/EnvironmentSelector'
import '../styles/Customize.css'

const Customize = () => {
  const { 
    theme, 
    selectedEnvironment, 
    uploadedAvatarUrl,
    modelModifiers,
    setModelModifiers,
    updateModelModifier
  } = useStore()
  
  const env = selectedEnvironment || 'city'
  const modelUrl = uploadedAvatarUrl || '/models/avatar.glb'

  const handleColorChange = (type, color) => {
    // Convert hex color string to number
    const hexNumber = parseInt(color.replace('#', ''), 16)
    updateModelModifier(type, hexNumber)
  }

  const handleScaleChange = (value) => {
    updateModelModifier('scale', parseFloat(value))
  }

  const handleRotationChange = (axis, value) => {
    setModelModifiers({
      rotation: {
        ...modelModifiers.rotation,
        [axis]: parseFloat(value) * (Math.PI / 180) // Convert degrees to radians
      }
    })
  }

  const handleAccessoryToggle = (accessory, value) => {
    setModelModifiers({
      accessories: {
        ...modelModifiers.accessories,
        [accessory]: value
      }
    })
  }

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
          <div className="avatar-scene-container">
            <Canvas
              shadows
              gl={{ 
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
              }}
              dpr={[1, 2]}
            >
              <PerspectiveCamera
                makeDefault
                position={[0, 1.2, 3.5]}
                fov={55}
              />

              <ambientLight intensity={0.4} />
              
              <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                color={theme === 'dark' ? '#00ffff' : '#ffffff'}
                castShadow
              />
              
              <directionalLight
                position={[-5, 3, -5]}
                intensity={0.6}
                color={theme === 'dark' ? '#ff00ff' : '#ffffff'}
              />
              
              <pointLight
                position={[0, 2, -3]}
                intensity={0.8}
                color="#0080ff"
                distance={10}
              />
              
              <pointLight
                position={[0, 1.5, 0]}
                intensity={1.5}
                color="#00ffff"
                distance={5}
              />

              <Suspense fallback={null}>
                <Environment preset={env} />
              </Suspense>

              <ContactShadows
                position={[0, -0.5, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4.5}
              />

              <Suspense fallback={null}>
                <DynamicAvatar modelUrl={modelUrl} />
              </Suspense>

              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
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
          </div>
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
            
            {/* Skin Color */}
            <div className="control-group">
              <label>Skin Color</label>
              <input
                type="color"
                value={`#${(modelModifiers.skinColor || 0xffdbac).toString(16).padStart(6, '0')}`}
                onChange={(e) => handleColorChange('skinColor', e.target.value)}
                className="color-picker"
              />
            </div>

            {/* Hair Color */}
            <div className="control-group">
              <label>Hair Color</label>
              <input
                type="color"
                value={`#${(modelModifiers.hairColor || 0x8b4513).toString(16).padStart(6, '0')}`}
                onChange={(e) => handleColorChange('hairColor', e.target.value)}
                className="color-picker"
              />
            </div>

            {/* Clothes Color */}
            <div className="control-group">
              <label>Clothes Color</label>
              <input
                type="color"
                value={`#${(modelModifiers.clothesColor || 0x4169e1).toString(16).padStart(6, '0')}`}
                onChange={(e) => handleColorChange('clothesColor', e.target.value)}
                className="color-picker"
              />
            </div>

            {/* Scale */}
            <div className="control-group">
              <label>Scale: {modelModifiers.scale?.toFixed(2) || '1.00'}</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={modelModifiers.scale || 1.0}
                onChange={(e) => handleScaleChange(e.target.value)}
                className="slider"
              />
            </div>

            {/* Rotation */}
            <div className="control-group">
              <label>Rotation</label>
              <div className="rotation-controls">
                <div className="rotation-axis">
                  <span>X: {Math.round((modelModifiers.rotation?.x || 0) * (180 / Math.PI))}°</span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={Math.round((modelModifiers.rotation?.x || 0) * (180 / Math.PI))}
                    onChange={(e) => handleRotationChange('x', e.target.value)}
                    className="slider"
                  />
                </div>
                <div className="rotation-axis">
                  <span>Y: {Math.round((modelModifiers.rotation?.y || 0) * (180 / Math.PI))}°</span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={Math.round((modelModifiers.rotation?.y || 0) * (180 / Math.PI))}
                    onChange={(e) => handleRotationChange('y', e.target.value)}
                    className="slider"
                  />
                </div>
                <div className="rotation-axis">
                  <span>Z: {Math.round((modelModifiers.rotation?.z || 0) * (180 / Math.PI))}°</span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={Math.round((modelModifiers.rotation?.z || 0) * (180 / Math.PI))}
                    onChange={(e) => handleRotationChange('z', e.target.value)}
                    className="slider"
                  />
                </div>
              </div>
            </div>

            {/* Accessories */}
            <div className="control-group">
              <label>Accessories</label>
              <div className="accessory-controls">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={modelModifiers.accessories?.hat || false}
                    onChange={(e) => handleAccessoryToggle('hat', e.target.checked)}
                  />
                  <span>Hat</span>
                </label>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={modelModifiers.accessories?.glasses || false}
                    onChange={(e) => handleAccessoryToggle('glasses', e.target.checked)}
                  />
                  <span>Glasses</span>
                </label>
              </div>
            </div>

            {/* Reset Button */}
            <motion.button
              className="reset-button"
              onClick={() => setModelModifiers({
                skinColor: null,
                hairColor: null,
                clothesColor: null,
                scale: 1.0,
                rotation: { x: 0, y: 0, z: 0 },
                accessories: { hat: false, glasses: false },
                hairstyle: null,
              })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Appearance
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Customize
