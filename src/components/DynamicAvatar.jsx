import React, { useRef, useEffect, useState, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useStore } from '../store/useStore'
import ErrorBoundary from './ErrorBoundary'
import * as THREE from 'three'

/**
 * LoadingSpinner - 3D loading indicator
 */
const LoadingSpinner = () => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, 1.5, 0]}>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial color="#ff9a9e" emissive="#ff9a9e" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.5, 0.1, 16, 32]} />
        <meshStandardMaterial color="#fecfef" emissive="#fecfef" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

/**
 * Placeholder Avatar Component
 */
const PlaceholderAvatar = () => {
  const group = useRef()
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={group}>
      <mesh position={[0, 1.5, 0]}>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshStandardMaterial
          color="#ff9a9e"
          emissive="#ff9a9e"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}

/**
 * Expression to Morph Target Name Mapping
 */
const expressionMorphMap = {
  happy: ['happy', 'smile', 'joy', 'cheerful'],
  sad: ['sad', 'sorrow', 'unhappy', 'frown'],
  angry: ['angry', 'mad', 'furious', 'rage'],
  surprised: ['surprised', 'surprise', 'shocked', 'amazed'],
  excited: ['excited', 'enthusiastic', 'thrilled', 'elated'],
  neutral: ['neutral', 'default', 'normal', 'rest'],
}

/**
 * DynamicAvatarLoader - Loads and displays the model with full state support
 */
const DynamicAvatarLoader = ({ modelUrl }) => {
  const group = useRef()
  const modelRef = useRef()
  const [modelLoaded, setModelLoaded] = useState(false)
  const [availableMorphs, setAvailableMorphs] = useState({})
  
  const { 
    currentAnimation, 
    currentExpression, 
    currentGesture,
    animationSpeed,
    isTalking,
    modelModifiers,
    focusMode,
    setFocusMode
  } = useStore()

  // Focus mode scale and position
  const originalScale = useRef(new THREE.Vector3(1, 1, 1))
  const originalPosition = useRef(new THREE.Vector3(0, 0, 0))
  const targetScale = useRef(new THREE.Vector3(1, 1, 1))
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0))
  const currentScale = useRef(new THREE.Vector3(1, 1, 1))
  const currentPosition = useRef(new THREE.Vector3(0, 0, 0))

  // Load the model
  const gltf = useGLTF(modelUrl)

  // Get animations if model loaded
  const { actions } = useAnimations(gltf?.animations || [], group)

  // Animation state management
  const [activeAnimation, setActiveAnimation] = useState(null)
  const [talkAnimation, setTalkAnimation] = useState(null)
  const previousAnimation = useRef(null)

  // Store original materials for color modification
  const originalMaterials = useRef({})

  // Check if model loaded and extract morph targets
  useEffect(() => {
    if (gltf && gltf.scene) {
      setModelLoaded(true)
      modelRef.current = gltf.scene
      
      console.log('✅ Dynamic avatar loaded:', modelUrl)
      console.log('Available animations:', Object.keys(actions || {}))
      
      // Extract available morph targets
      const morphs = {}
      gltf.scene.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
          Object.keys(child.morphTargetDictionary).forEach(key => {
            morphs[key.toLowerCase()] = child.morphTargetDictionary[key]
          })
        }
      })
      setAvailableMorphs(morphs)
      console.log('Available morph targets:', Object.keys(morphs))
      
      // Store original materials
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const materialKey = child.uuid || child.name
          originalMaterials.current[materialKey] = child.material.clone()
        }
      })
    }
  }, [gltf, actions, modelUrl])

  // Initialize animations
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Find idle animation
      const idleAnim = actions['Idle'] || 
                      actions['idle'] || 
                      actions[Object.keys(actions).find(k => k.toLowerCase().includes('idle'))] ||
                      Object.values(actions)[0]
      
      // Find talk animation
      const talkAnim = actions['Talk'] || 
                      actions['talk'] || 
                      actions['Talking'] ||
                      actions['talking'] ||
                      actions[Object.keys(actions).find(k => k.toLowerCase().includes('talk'))]
      
      if (idleAnim) {
        idleAnim.play()
        idleAnim.fadeIn(0.5)
        idleAnim.setLoop(THREE.LoopRepeat)
        setActiveAnimation(idleAnim)
        previousAnimation.current = idleAnim
      }
      
      if (talkAnim) {
        talkAnim.setLoop(THREE.LoopRepeat)
        setTalkAnimation(talkAnim)
      }
    }
  }, [actions])

  // Handle isTalking state - play talk animation or lip-sync
  useEffect(() => {
    if (!actions) return

    if (isTalking) {
      // If talk animation exists, use it
      if (talkAnimation && activeAnimation) {
        activeAnimation.fadeOut(0.3)
        talkAnimation.reset().fadeIn(0.3).play()
        setActiveAnimation(talkAnimation)
      } else {
        // Otherwise, try to find a talk animation
        const talkAnim = actions['Talk'] || 
                        actions['talk'] || 
                        actions[Object.keys(actions).find(k => k.toLowerCase().includes('talk'))]
        if (talkAnim && activeAnimation) {
          activeAnimation.fadeOut(0.3)
          talkAnim.reset().fadeIn(0.3).play()
          talkAnim.setLoop(THREE.LoopRepeat)
          setActiveAnimation(talkAnim)
        }
      }
    } else {
      // Return to previous animation or idle
      if (talkAnimation && talkAnimation.isPlaying()) {
        talkAnimation.fadeOut(0.3)
        const idleAnim = actions['Idle'] || actions['idle'] || Object.values(actions)[0]
        if (idleAnim) {
          idleAnim.reset().fadeIn(0.3).play()
          idleAnim.setLoop(THREE.LoopRepeat)
          setActiveAnimation(idleAnim)
        }
      }
    }
  }, [isTalking, actions, talkAnimation, activeAnimation])

  // Handle animation changes (excluding talk which is handled by isTalking)
  useEffect(() => {
    if (!actions || !currentAnimation || isTalking) return

    const targetAnim = actions[currentAnimation] || 
                      actions[currentAnimation.toLowerCase()] ||
                      actions[Object.keys(actions).find(k => 
                        k.toLowerCase().includes(currentAnimation.toLowerCase())
                      )]

    if (targetAnim && targetAnim !== activeAnimation && targetAnim !== talkAnimation) {
      if (previousAnimation.current) {
        previousAnimation.current.fadeOut(0.3)
      }

      targetAnim.reset().fadeIn(0.3).play()
      targetAnim.setLoop(THREE.LoopRepeat)
      
      if (animationSpeed) {
        targetAnim.timeScale = animationSpeed
      }

      setActiveAnimation(targetAnim)
      previousAnimation.current = targetAnim
    }
  }, [currentAnimation, actions, animationSpeed, activeAnimation, isTalking, talkAnimation])

  // Handle gesture animations
  useEffect(() => {
    if (!actions || !currentGesture || isTalking) return

    const gestureAnim = actions[currentGesture] || 
                       actions[currentGesture.toLowerCase()] ||
                       actions[Object.keys(actions).find(k => 
                         k.toLowerCase().includes(currentGesture.toLowerCase())
                       )]

    if (gestureAnim) {
      if (activeAnimation && activeAnimation !== gestureAnim) {
        activeAnimation.fadeOut(0.2)
      }
      
      gestureAnim.reset().fadeIn(0.2).play()
      gestureAnim.setLoop(THREE.LoopOnce)
      gestureAnim.clampWhenFinished = true

      const handleFinished = () => {
        const idleAnim = actions['Idle'] || actions['idle'] || activeAnimation
        if (idleAnim && idleAnim !== gestureAnim) {
          gestureAnim.fadeOut(0.3)
          idleAnim.fadeIn(0.3).play()
          setActiveAnimation(idleAnim)
        }
        gestureAnim.removeEventListener('finished', handleFinished)
      }
      
      gestureAnim.addEventListener('finished', handleFinished)
    }
  }, [currentGesture, actions, activeAnimation, isTalking])

  // Store current expression for frame-by-frame updates
  const currentExpressionRef = useRef(currentExpression)
  useEffect(() => {
    currentExpressionRef.current = currentExpression
  }, [currentExpression])

  // Handle expressions with improved morph target mapping
  useEffect(() => {
    if (!gltf || !gltf.scene) {
      return
    }

    const expressionName = currentExpression ? currentExpression.toLowerCase() : null

    // First, try to find expression as animation
    if (expressionName && actions) {
      const expressionAnim = actions[expressionName] || 
                            actions[expressionName.charAt(0).toUpperCase() + expressionName.slice(1)] ||
                            actions[Object.keys(actions).find(k => 
                              k.toLowerCase().includes(expressionName)
                            )]
      
      if (expressionAnim && expressionAnim !== activeAnimation) {
        // Play expression as animation
        if (activeAnimation && activeAnimation !== expressionAnim) {
          activeAnimation.fadeOut(0.2)
        }
        expressionAnim.reset().fadeIn(0.3).play()
        expressionAnim.setLoop(THREE.LoopRepeat)
        setActiveAnimation(expressionAnim)
        console.log(`✅ Expression "${expressionName}" applied as animation`)
      }
    }
  }, [currentExpression, gltf, actions, activeAnimation])

  // Apply morph targets every frame for smooth updates
  useFrame(() => {
    if (!gltf || !gltf.scene || !currentExpressionRef.current) {
      // Reset morph targets when no expression
      if (gltf && gltf.scene) {
        gltf.scene.traverse((child) => {
          if ((child.isSkinnedMesh || child.isMesh) && child.morphTargetDictionary && child.morphTargetInfluences) {
            const morphDict = child.morphTargetDictionary
            Object.keys(morphDict).forEach(key => {
              const index = morphDict[key]
              if (index !== undefined && child.morphTargetInfluences && child.morphTargetInfluences[index] !== undefined) {
                child.morphTargetInfluences[index] = 0
              }
            })
          }
        })
      }
      return
    }

    const expressionName = currentExpressionRef.current.toLowerCase()
    let expressionApplied = false

    // Apply morph targets
    gltf.scene.traverse((child) => {
      if ((child.isSkinnedMesh || child.isMesh) && child.morphTargetDictionary && child.morphTargetInfluences) {
        const morphDict = child.morphTargetDictionary
        const morphInfluences = child.morphTargetInfluences
        
        // Reset all morph targets first
        Object.keys(morphDict).forEach(key => {
          const index = morphDict[key]
          if (index !== undefined && morphInfluences && morphInfluences[index] !== undefined) {
            morphInfluences[index] = 0
          }
        })

        // Try to find matching morph target
        const morphKeys = expressionMorphMap[expressionName] || [expressionName]
        
        for (const key of morphKeys) {
          // Try exact match first
          let morphIndex = morphDict[key]
          
          // Try case-insensitive match
          if (morphIndex === undefined) {
            const matchingKey = Object.keys(morphDict).find(k => 
              k.toLowerCase() === key.toLowerCase()
            )
            if (matchingKey) {
              morphIndex = morphDict[matchingKey]
            }
          }
          
          // Try partial match
          if (morphIndex === undefined) {
            const matchingKey = Object.keys(morphDict).find(k => 
              k.toLowerCase().includes(key) || key.includes(k.toLowerCase())
            )
            if (matchingKey) {
              morphIndex = morphDict[matchingKey]
            }
          }
          
          if (morphIndex !== undefined && morphInfluences && morphInfluences[morphIndex] !== undefined) {
            morphInfluences[morphIndex] = 1.0
            expressionApplied = true
            break
          }
        }
      }
    })

    // Log once per expression change (not every frame)
    if (expressionApplied && gltf.scene.userData.lastExpression !== expressionName) {
      gltf.scene.userData.lastExpression = expressionName
      console.log(`✅ Expression "${expressionName}" applied`)
    }
  })

  // Apply model modifiers (color, scale, rotation, accessories)
  useEffect(() => {
    if (!gltf || !gltf.scene) return

    const scene = gltf.scene

    // Apply scale (multiply with auto-scale if it exists)
    if (modelModifiers.scale !== undefined) {
      const autoScale = scene.userData.autoScale || 1.0
      const finalScale = autoScale * modelModifiers.scale
      scene.scale.set(finalScale, finalScale, finalScale)
    }

    // Apply rotation
    if (modelModifiers.rotation) {
      scene.rotation.x = modelModifiers.rotation.x || 0
      scene.rotation.y = modelModifiers.rotation.y || 0
      scene.rotation.z = modelModifiers.rotation.z || 0
    }

    // Apply color modifications
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Skin color
        if (modelModifiers.skinColor) {
          // Try to identify skin material (common names)
          const name = child.name.toLowerCase()
          if (name.includes('skin') || name.includes('face') || name.includes('body')) {
            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
              child.material.color.setHex(modelModifiers.skinColor)
            }
          }
        }

        // Hair color
        if (modelModifiers.hairColor) {
          const name = child.name.toLowerCase()
          if (name.includes('hair') || name.includes('head')) {
            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
              child.material.color.setHex(modelModifiers.hairColor)
            }
          }
        }

        // Clothes color
        if (modelModifiers.clothesColor) {
          const name = child.name.toLowerCase()
          if (name.includes('cloth') || name.includes('shirt') || name.includes('dress') || name.includes('pants')) {
            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
              child.material.color.setHex(modelModifiers.clothesColor)
            }
          }
        }

        // Toggle accessories visibility
        if (modelModifiers.accessories) {
          if (modelModifiers.accessories.hat !== undefined) {
            const name = child.name.toLowerCase()
            if (name.includes('hat') || name.includes('cap')) {
              child.visible = modelModifiers.accessories.hat
            }
          }
          if (modelModifiers.accessories.glasses !== undefined) {
            const name = child.name.toLowerCase()
            if (name.includes('glass') || name.includes('spectacle')) {
              child.visible = modelModifiers.accessories.glasses
            }
          }
        }
      }
    })
  }, [gltf, modelModifiers])

  // Handle click to enter focus mode
  const handlePointerDown = (event) => {
    event.stopPropagation()
    // Only enter focus mode if not already in focus mode
    if (!focusMode) {
      setFocusMode(true)
    }
  }

  // Handle focus mode scale and position
  useEffect(() => {
    if (gltf && gltf.scene) {
      const scene = gltf.scene
      const autoScale = scene.userData.autoScale || 1.0
      const baseScale = modelModifiers.scale || 1.0
      const currentBaseScale = autoScale * baseScale

      if (focusMode) {
        // Store original values
        if (!originalScale.current.equals(scene.scale)) {
          originalScale.current.copy(scene.scale)
        }
        if (!originalPosition.current.equals(scene.position)) {
          originalPosition.current.copy(scene.position)
        }
        
        // Set focus mode targets (scale up 1.3x, center position)
        targetScale.current.set(
          currentBaseScale * 1.3,
          currentBaseScale * 1.3,
          currentBaseScale * 1.3
        )
        targetPosition.current.set(0, 0, 0)
      } else {
        // Return to normal
        targetScale.current.copy(originalScale.current)
        targetPosition.current.copy(originalPosition.current)
      }
    }
  }, [focusMode, gltf, modelModifiers.scale])

  // Animate scale and position smoothly
  useFrame((state, delta) => {
    if (gltf && gltf.scene && group.current) {
      const lerpFactor = 0.15
      
      // Lerp scale
      currentScale.current.lerp(targetScale.current, lerpFactor)
      gltf.scene.scale.copy(currentScale.current)
      
      // Lerp position
      currentPosition.current.lerp(targetPosition.current, lerpFactor)
      gltf.scene.position.copy(currentPosition.current)
    }
  })

  // Calculate model bounds and scale/center it (only once on load)
  useEffect(() => {
    if (gltf && gltf.scene) {
      requestAnimationFrame(() => {
        try {
          const box = new THREE.Box3().setFromObject(gltf.scene)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          
          // Store original scale if not set
          if (!gltf.scene.userData.originalScale) {
            gltf.scene.userData.originalScale = gltf.scene.scale.clone()
            gltf.scene.userData.originalPosition = gltf.scene.position.clone()
            originalScale.current.copy(gltf.scene.scale)
            originalPosition.current.copy(gltf.scene.position)
            currentScale.current.copy(gltf.scene.scale)
            currentPosition.current.copy(gltf.scene.position)
          }
          
          // Center the model
          const centeredX = -center.x
          const centeredY = -center.y
          const centeredZ = -center.z
          
          gltf.scene.position.set(centeredX, centeredY, centeredZ)
          originalPosition.current.set(centeredX, centeredY, centeredZ)
          currentPosition.current.set(centeredX, centeredY, centeredZ)
          targetPosition.current.set(centeredX, centeredY, centeredZ)
          
          // Scale to reasonable size (only if not already scaled by modifiers)
          const baseScale = modelModifiers.scale || 1.0
          if (baseScale === 1.0) {
            const maxDimension = Math.max(size.x, size.y, size.z)
            // Better target size for visibility
            const targetSize = 1.8
            const autoScale = targetSize / maxDimension
            gltf.scene.scale.set(autoScale, autoScale, autoScale)
            gltf.scene.userData.autoScale = autoScale
            originalScale.current.set(autoScale, autoScale, autoScale)
            currentScale.current.set(autoScale, autoScale, autoScale)
            targetScale.current.set(autoScale, autoScale, autoScale)
            console.log('Dynamic avatar auto-scaled by:', autoScale, 'Model size:', maxDimension)
          } else {
            // Apply user-defined scale
            const autoScale = gltf.scene.userData.autoScale || 1.0
            const finalScale = autoScale * baseScale
            gltf.scene.scale.set(finalScale, finalScale, finalScale)
            originalScale.current.set(finalScale, finalScale, finalScale)
            currentScale.current.set(finalScale, finalScale, finalScale)
            targetScale.current.set(finalScale, finalScale, finalScale)
          }
        } catch (error) {
          console.error('Error calculating model bounds:', error)
        }
      })
    }
  }, [gltf, modelModifiers.scale])

  // If no model loaded, show placeholder
  if (!gltf || !gltf.scene) {
    return <PlaceholderAvatar />
  }

  return (
    <group 
      ref={group} 
      dispose={null}
      onPointerDown={handlePointerDown}
    >
      <primitive object={gltf.scene} />
    </group>
  )
}

/**
 * DynamicAvatar - Loads any .glb/.gltf model dynamically
 */
const DynamicAvatar = ({ modelUrl }) => {
  if (!modelUrl) {
    return <PlaceholderAvatar />
  }

  return (
    <ErrorBoundary fallback={<PlaceholderAvatar />}>
      <Suspense fallback={<LoadingSpinner />}>
        <DynamicAvatarLoader modelUrl={modelUrl} />
      </Suspense>
    </ErrorBoundary>
  )
}

export default DynamicAvatar
