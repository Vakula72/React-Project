import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei'
import AvatarCartoon from './AvatarCartoon'

/**
 * AvatarCartoonScene - Full-screen 3D scene for Home page
 * Optimized for large, centered avatar display
 */
const AvatarCartoonScene = ({ scrollY = 0, isScrolling = false, mouseX = 0, mouseY = 0 }) => {
  return (
    <div className="avatar-cartoon-scene">
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        {/* Camera Setup - Optimized for large, centered model */}
        <PerspectiveCamera
          makeDefault
          position={[0, 0.8, 3]}
          fov={50}
        />

        {/* Soft, Natural Lighting */}
        <ambientLight intensity={0.7} />
        
        {/* Main Key Light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          color="#ffffff"
          castShadow
        />
        
        {/* Fill Light - Warm */}
        <directionalLight
          position={[-5, 3, -5]}
          intensity={0.5}
          color="#fff5e6"
        />
        
        {/* Soft Rim Light */}
        <pointLight
          position={[0, 2, -3]}
          intensity={0.6}
          color="#fff5e6"
          distance={10}
        />

        {/* Soft Environment */}
        <Suspense fallback={null}>
          <Environment preset="sunset" />
        </Suspense>

        {/* Ground Shadow */}
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.25}
          scale={8}
          blur={2}
          far={4}
          color="#000000"
        />

        {/* Avatar */}
        <AvatarCartoon 
          scrollY={scrollY}
          isScrolling={isScrolling}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Canvas>
    </div>
  )
}

export default AvatarCartoonScene
