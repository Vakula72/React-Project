import { create } from 'zustand'

/**
 * Global State Management using Zustand
 * Manages avatar animations, expressions, gestures, theme, and UI state
 */
export const useStore = create((set) => ({
  // Theme
  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  // Avatar Animations
  currentAnimation: 'Idle',
  setCurrentAnimation: (animation) => set({ currentAnimation: animation }),
  
  animationSpeed: 1.0,
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

  // Expressions
  currentExpression: null,
  setCurrentExpression: (expression) => set({ currentExpression: expression }),

  // Gestures
  currentGesture: null,
  setCurrentGesture: (gesture) => set({ currentGesture: gesture }),

  // Environment
  selectedEnvironment: 'city',
  setSelectedEnvironment: (env) => set({ selectedEnvironment: env }),

  // Chat/Interaction
  chatMessages: [],
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
  clearChat: () => set({ chatMessages: [] }),

  // Voice
  isListening: false,
  setIsListening: (listening) => set({ isListening: listening }),

  // UI State
  isMenuOpen: false,
  setIsMenuOpen: (open) => set({ isMenuOpen: open }),
}))


