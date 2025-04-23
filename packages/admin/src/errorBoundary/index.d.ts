import React from 'react'

export interface ErrorBoundaryProps {
  fallback?: any
  onError?(error: Error, errorInfo: React.ErrorInfo)
}
declare class ErrorBoundary extends React.Component<ErrorBoundaryProps> {}
export default ErrorBoundary
