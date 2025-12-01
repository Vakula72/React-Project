import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '../store/useStore'
import * as THREE from 'three'

/**
 * FocusCamera - Handles smooth camera animation for focus mode
 */
const FocusCamera = () => {
  const { camera } = useThree()
  const { focusMode } = useStore()
  
  // Camera state
  const targetPosition = useRef(new THREE.Vector3(0, 1.2, 3.5))
  const currentPosition = useRef(new THREE.Vector3(0, 1.2, 3.5))
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0))
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0))
  const isInitialized = useRef(false)
  
  // Normal mode camera settings
  const normalPosition = new THREE.Vector3(0, 1.2, 3.5)
  const normalLookAt = new THREE.Vector3(0, 1, 0)
  
  // Focus mode camera settings (closer, centered)
  const focusPosition = new THREE.Vector3(0, 1.3, 2.2)
  const focusLookAt = new THREE.Vector3(0, 1.2, 0)

  // Initialize camera position
  useEffect(() => {
    if (!isInitialized.current && camera) {
      currentPosition.current.copy(camera.position)
      targetPosition.current.copy(camera.position)
      isInitialized.current = true
    }
  }, [camera])

  // Update target based on focus mode
  useEffect(() => {
    if (focusMode) {
      targetPosition.current.copy(focusPosition)
      targetLookAt.current.copy(focusLookAt)
    } else {
      targetPosition.current.copy(normalPosition)
      targetLookAt.current.copy(normalLookAt)
    }
  }, [focusMode])

  // Smooth camera animation
  useFrame((state, delta) => {
    if (!camera) return
    
    const lerpFactor = 0.12 // Smooth interpolation speed
    
    // Lerp camera position
    currentPosition.current.lerp(targetPosition.current, lerpFactor)
    camera.position.copy(currentPosition.current)
    
    // Lerp look at target
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor)
    
    // Make camera look at target
    camera.lookAt(currentLookAt.current)
    
    // Update camera matrix
    camera.updateMatrixWorld()
  })

  return null
}

export default FocusCamera

