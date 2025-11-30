import React from 'react'

/**
 * Error Boundary for 3D Model Loading
 * Catches errors when model files fail to load
 */
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Model loading error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Model failed to load</div>
    }

    return this.props.children
  }
}

export default ModelErrorBoundary

