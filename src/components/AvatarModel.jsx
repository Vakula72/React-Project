import React, { useRef, useEffect, useState, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useStore } from '../store/useStore'
import ErrorBoundary from './ErrorBoundary'
import * as THREE from 'three'

/**
 * Placeholder Avatar Component (shown when model file is not found)
 */
const PlaceholderAvatar = ({ meshRef: externalMeshRef }) => {
  const group = useRef()
  const meshRef = useRef(externalMeshRef?.current)
  const materialRef = useRef()
  
  useFrame((state) => {
    if (group.current) {
      // Subtle rotation
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    
    // Floating animation
    if (meshRef.current) {
      const baseY = 1.5
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime) * 0.05
    }
    
    // Pulsing glow
    if (materialRef.current) {
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      materialRef.current.emissiveIntensity = intensity
    }
  })

  return (
    <group ref={group}>
      {/* Placeholder Avatar - Simple geometry with holographic material */}
      <mesh ref={meshRef} position={[0, 1.5, 0]}>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Animated rings for holographic effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.5, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

/**
 * AvatarModel - 3D Avatar with Animation System
 * 
 * Features:
 * - Loads GLB model with animations
 * - Idle animation loop
 * - Gesture animations (wave, nod, shake)
 * - Expression morphing (happy, sad, surprised, etc.)
 * - Animation blending and transitions
 * - Holographic material effects
 */
const AvatarModel = ({ modelPath = '/models/avatar.glb' }) => {
  return (
    <ErrorBoundary fallback={<PlaceholderAvatar />}>
      <Suspense fallback={<PlaceholderAvatar />}>
        <AvatarModelLoader modelPath={modelPath} />
      </Suspense>
    </ErrorBoundary>
  )
}

// Internal component that actually loads the model
const AvatarModelLoader = ({ modelPath }) => {
  const group = useRef()
  const meshRef = useRef()
  
  // Store state
  const { 
    currentAnimation, 
    currentExpression, 
    currentGesture,
    animationSpeed 
  } = useStore()

  // Load the model - useGLTF will handle loading
  // If file doesn't exist, it will throw and ErrorBoundary will catch it
  const gltf = useGLTF(modelPath)
  const { animations } = useAnimations(gltf?.animations || [], group)
  
  // Animation state management
  const [activeAnimation, setActiveAnimation] = useState(null)
  const previousAnimation = useRef(null)

  // Initialize animations (when model is loaded)
  useEffect(() => {
    if (animations && Object.keys(animations).length > 0) {
      // Set default idle animation
      const idleAnim = animations['Idle'] || animations['idle'] || Object.values(animations)[0]
      if (idleAnim) {
        idleAnim.play()
        idleAnim.fadeIn(0.5)
        setActiveAnimation(idleAnim)
        previousAnimation.current = idleAnim
      }
    }
  }, [animations])

  // Handle animation changes
  useEffect(() => {
    if (!animations || !currentAnimation) return

    const targetAnim = animations[currentAnimation] || 
                      animations[currentAnimation.toLowerCase()] ||
                      animations[Object.keys(animations).find(k => 
                        k.toLowerCase().includes(currentAnimation.toLowerCase())
                      )]

    if (targetAnim && targetAnim !== activeAnimation) {
      // Fade out previous animation
      if (previousAnimation.current) {
        previousAnimation.current.fadeOut(0.3)
      }

      // Fade in new animation
      targetAnim.reset().fadeIn(0.3).play()
      targetAnim.setLoop(THREE.LoopRepeat)
      
      // Adjust speed
      if (animationSpeed) {
        targetAnim.timeScale = animationSpeed
      }

      setActiveAnimation(targetAnim)
      previousAnimation.current = targetAnim
    }
  }, [currentAnimation, animations, animationSpeed, activeAnimation])

  // Handle gesture animations (one-shot)
  useEffect(() => {
    if (!animations || !currentGesture) return

    const gestureAnim = animations[currentGesture] || 
                       animations[Object.keys(animations).find(k => 
                         k.toLowerCase().includes(currentGesture.toLowerCase())
                       )]

    if (gestureAnim) {
      // Play gesture once
      gestureAnim.reset().play()
      gestureAnim.setLoop(THREE.LoopOnce)
      gestureAnim.clampWhenFinished = true

      // Return to idle after gesture
      const handleFinished = () => {
        const idleAnim = animations['Idle'] || animations['idle'] || activeAnimation
        if (idleAnim) {
          gestureAnim.fadeOut(0.3)
          idleAnim.fadeIn(0.3).play()
          setActiveAnimation(idleAnim)
        }
        gestureAnim.removeEventListener('finished', handleFinished)
      }
      
      gestureAnim.addEventListener('finished', handleFinished)
    }
  }, [currentGesture, animations, activeAnimation])

  // Expression morphing (if model supports morph targets)
  useEffect(() => {
    if (!gltf || !gltf.scene || !currentExpression) return

    gltf.scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const morphDict = child.morphTargetDictionary
        const expressionName = currentExpression.toLowerCase()
        
        // Reset all expressions first
        Object.keys(morphDict).forEach(key => {
          if (child.morphTargetInfluences) {
            const index = morphDict[key]
            if (index !== undefined) {
              child.morphTargetInfluences[index] = 0
            }
          }
        })

        // Apply current expression
        const morphIndex = morphDict[expressionName] || 
                          morphDict[Object.keys(morphDict).find(k => 
                            k.toLowerCase().includes(expressionName)
                          )]
        
        if (morphIndex !== undefined && child.morphTargetInfluences) {
          child.morphTargetInfluences[morphIndex] = 1.0
        }
      }
    })
  }, [currentExpression, gltf])

  // Apply holographic material to loaded model
  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Enhance materials with holographic properties
          if (child.material) {
            child.material = child.material.clone()
            child.material.emissive = new THREE.Color(0x00ffff)
            child.material.emissiveIntensity = 0.2
            child.material.metalness = 0.7
            child.material.roughness = 0.3
            child.material.transparent = true
            child.material.opacity = 0.95
            
            // Add rim lighting effect
            child.material.onBeforeCompile = (shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                '#include <output_fragment>',
                `
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                float rim = 1.0 - max(0.0, dot(viewDir, normalize(vNormal)));
                vec3 rimColor = vec3(0.0, 1.0, 1.0) * pow(rim, 2.0);
                gl_FragColor.rgb += rimColor * 0.5;
                #include <output_fragment>
                `
              )
            }
          }
          
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [gltf])

  // Holographic effect animation
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      const baseY = 0
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime) * 0.05
      
      // Holographic glow pulse
      if (meshRef.current.material) {
        const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2
        if (meshRef.current.material.emissive) {
          meshRef.current.material.emissive.setScalar(intensity)
        }
      }
    }
  })

  // If no model loaded, show placeholder
  if (!gltf || !gltf.scene) {
    return <PlaceholderAvatar meshRef={meshRef} />
  }

  return (
    <group ref={group} dispose={null}>
      <primitive 
        ref={meshRef}
        object={gltf.scene} 
        scale={1} 
        position={[0, 0, 0]}
      />
    </group>
  )
}

// Preload model (optional optimization)
// useGLTF.preload('/models/avatar.glb')

export default AvatarModel
