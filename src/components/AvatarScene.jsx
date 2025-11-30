import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import { useStore } from '../store/useStore'
import AvatarModel from './AvatarModel'
import '../styles/AvatarScene.css'

/**
 * AvatarScene - Main 3D scene container
 * Handles Three.js canvas setup, lighting, camera, and environment
 */
const AvatarScene = ({ 
  enableControls = true,
  cameraPosition = [0, 1.6, 5],
  environment = 'city'
}) => {
  const { theme, selectedEnvironment } = useStore()
  const env = selectedEnvironment || environment

  return (
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
        {/* Camera Setup */}
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={50}
        />

        {/* Dynamic Lighting System */}
        <ambientLight intensity={0.4} />
        
        {/* Main Key Light - Cyan/Blue */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          color={theme === 'dark' ? '#00ffff' : '#ffffff'}
          castShadow
        />
        
        {/* Fill Light - Pink/Purple */}
        <directionalLight
          position={[-5, 3, -5]}
          intensity={0.6}
          color={theme === 'dark' ? '#ff00ff' : '#ffffff'}
        />
        
        {/* Rim Light for Holographic Effect */}
        <pointLight
          position={[0, 2, -3]}
          intensity={0.8}
          color="#0080ff"
          distance={10}
        />
        
        {/* Holographic Glow Effect */}
        <pointLight
          position={[0, 1.5, 0]}
          intensity={1.5}
          color="#00ffff"
          distance={5}
        />

        {/* Environment - HDR or Procedural */}
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

        {/* Avatar Model */}
        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>

        {/* Camera Controls */}
        {enableControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>
    </div>
  )
}

export default AvatarScene

