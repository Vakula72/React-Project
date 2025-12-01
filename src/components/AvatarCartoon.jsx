import React, { useRef, useEffect, useState, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * AvatarCartoonLoader - Internal component that loads the anime model
 */
const AvatarCartoonLoader = ({ scrollY = 0, isScrolling = false, mouseX = 0, mouseY = 0 }) => {
  const group = useRef()
  const [walkAnimation, setWalkAnimation] = useState(null)
  const [idleAnimation, setIdleAnimation] = useState(null)
  
  // Smooth rotation targets for lerp
  const targetRotationY = useRef(0)
  const targetRotationX = useRef(0)
  const currentRotationY = useRef(0)
  const currentRotationX = useRef(0)
  
  // Load the anime model
  const modelPath = '/Anime Model/base_basic_pbr.glb'
  const gltf = useGLTF(modelPath)

  // Get animations if model loaded
  const { actions } = useAnimations(gltf?.animations || [], group)

  // Initialize animations
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      console.log('Available animations:', Object.keys(actions))
      
      // Look for walking animations
      const walkAnim = 
        actions['Walk'] || 
        actions['walk'] || 
        actions['Walking'] || 
        actions['walking'] ||
        actions['Walk Forward'] ||
        actions['walk_forward'] ||
        actions['Run'] ||
        actions['run'] ||
        actions['Running'] ||
        actions['running'] ||
        Object.values(actions).find(action => {
          const name = action.getClip().name.toLowerCase()
          return name.includes('walk') || name.includes('run') || name.includes('move')
        })

      // Look for idle animation
      const idleAnim = 
        actions['Idle'] || 
        actions['idle'] || 
        actions['Idle_01'] ||
        actions['idle_01'] ||
        Object.values(actions).find(action => {
          const name = action.getClip().name.toLowerCase()
          return name.includes('idle')
        }) ||
        Object.values(actions)[0] // Fallback to first animation

      if (idleAnim) {
        idleAnim.reset().fadeIn(0.5).play()
        idleAnim.setLoop(THREE.LoopRepeat)
        idleAnim.timeScale = 1.0
        setIdleAnimation(idleAnim)
        console.log('✅ Idle animation:', idleAnim.getClip().name)
      }

      if (walkAnim) {
        walkAnim.setLoop(THREE.LoopRepeat)
        walkAnim.timeScale = 1.0
        setWalkAnimation(walkAnim)
        console.log('✅ Walking animation:', walkAnim.getClip().name)
      }
    }
  }, [actions])

  // Handle scroll-based animation switching
  useEffect(() => {
    if (!walkAnimation || !idleAnimation) return

    if (isScrolling && scrollY > 5) {
      // User is scrolling - play walking animation
      if (idleAnimation.isPlaying()) {
        idleAnimation.fadeOut(0.3)
      }
      if (!walkAnimation.isPlaying()) {
        walkAnimation.reset().fadeIn(0.3).play()
      }
    } else {
      // User stopped scrolling - return to idle
      if (walkAnimation.isPlaying()) {
        walkAnimation.fadeOut(0.3)
      }
      if (!idleAnimation.isPlaying()) {
        idleAnimation.reset().fadeIn(0.3).play()
      }
    }
  }, [isScrolling, scrollY, walkAnimation, idleAnimation])

  // Update mouse-based rotation targets
  useEffect(() => {
    // Normalize mouse position to -1 to 1
    const normalizedX = (mouseX / window.innerWidth - 0.5) * 2
    const normalizedY = (mouseY / window.innerHeight - 0.5) * 2
    
    // Set rotation targets (smooth, limited range)
    targetRotationY.current = normalizedX * 0.3 // Max 0.3 radians left/right
    targetRotationX.current = -normalizedY * 0.15 // Max 0.15 radians forward/back tilt
  }, [mouseX, mouseY])

  // Animate model with smooth lerp
  useFrame((state, delta) => {
    if (group.current) {
      // Smooth lerp for rotation (never break walking animation)
      const lerpFactor = 0.1 // Smooth interpolation
      currentRotationY.current = THREE.MathUtils.lerp(
        currentRotationY.current,
        targetRotationY.current,
        lerpFactor
      )
      currentRotationX.current = THREE.MathUtils.lerp(
        currentRotationX.current,
        targetRotationX.current,
        lerpFactor
      )
      
      // Apply rotations
      group.current.rotation.y = currentRotationY.current
      group.current.rotation.x = currentRotationX.current
      
      // Subtle bobbing when walking
      if (isScrolling && scrollY > 5) {
        const walkBobbing = Math.sin(state.clock.elapsedTime * 4) * 0.03
        group.current.position.y = walkBobbing
      } else {
        // Gentle idle floating
        group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02
      }
    }
  })

  // If no model loaded, show placeholder
  if (!gltf || !gltf.scene) {
    return <PlaceholderCharacter scrollY={scrollY} isScrolling={isScrolling} mouseX={mouseX} mouseY={mouseY} />
  }

  // Calculate model bounds and scale/center it
  useEffect(() => {
    if (gltf && gltf.scene) {
      requestAnimationFrame(() => {
        try {
          const box = new THREE.Box3().setFromObject(gltf.scene)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          
          // Center the model horizontally and vertically
          gltf.scene.position.x = -center.x
          gltf.scene.position.y = -center.y + 0.3 // Raise model up slightly
          gltf.scene.position.z = -center.z
          
          // Scale to make it large and visible (60-70% viewport height)
          const targetHeight = 2.2 // Increased target height in 3D units
          const maxDimension = Math.max(size.x, size.y, size.z)
          const scale = targetHeight / maxDimension
          
          gltf.scene.scale.set(scale, scale, scale)
          console.log('Model scaled by:', scale, 'to height:', maxDimension * scale)
        } catch (error) {
          console.error('Error calculating model bounds:', error)
        }
      })
    }
  }, [gltf])

  return (
    <group ref={group} dispose={null}>
      <primitive object={gltf.scene} />
    </group>
  )
}

/**
 * AvatarCartoon - Anime character for Home page
 */
const AvatarCartoon = ({ scrollY = 0, isScrolling = false, mouseX = 0, mouseY = 0 }) => {
  return (
    <Suspense fallback={<PlaceholderCharacter scrollY={scrollY} isScrolling={isScrolling} mouseX={mouseX} mouseY={mouseY} />}>
      <AvatarCartoonLoader scrollY={scrollY} isScrolling={isScrolling} mouseX={mouseX} mouseY={mouseY} />
    </Suspense>
  )
}

/**
 * Placeholder Character - Simple friendly character when model not loaded
 */
const PlaceholderCharacter = ({ scrollY = 0, isScrolling = false, mouseX = 0, mouseY = 0 }) => {
  const group = useRef()
  const targetRotationY = useRef(0)
  const targetRotationX = useRef(0)
  const currentRotationY = useRef(0)
  const currentRotationX = useRef(0)
  
  useEffect(() => {
    const normalizedX = (mouseX / window.innerWidth - 0.5) * 2
    const normalizedY = (mouseY / window.innerHeight - 0.5) * 2
    targetRotationY.current = normalizedX * 0.3
    targetRotationX.current = -normalizedY * 0.15
  }, [mouseX, mouseY])
  
  useFrame((state, delta) => {
    if (group.current) {
      currentRotationY.current = THREE.MathUtils.lerp(currentRotationY.current, targetRotationY.current, 0.1)
      currentRotationX.current = THREE.MathUtils.lerp(currentRotationX.current, targetRotationX.current, 0.1)
      
      group.current.rotation.y = currentRotationY.current
      group.current.rotation.x = currentRotationX.current
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02
    }
  })

  return (
    <group ref={group}>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color="#FFE4E1" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[-0.5, 0.7, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial color="#FFE4E1" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0.5, 0.7, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
        <meshStandardMaterial color="#FFE4E1" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[-0.2, -0.3, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 4, 8]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0.2, -0.3, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 4, 8]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  )
}

export default AvatarCartoon
