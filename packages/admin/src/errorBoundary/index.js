import React from 'react'

class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { error }
  }
  state = { error: null }
  componentDidCatch(error, info) {
    console.error(error)
    this.props.onError?.(error, info)
  }
  render() {
    const { error } = this.state
    const { fallback, children } = this.props
    if (error !== null) {
      return fallback ?? null
    }
    return children
  }
}

export default ErrorBoundary
