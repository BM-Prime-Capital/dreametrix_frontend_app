"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

export function useSmartLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const stopLoading = useCallback(() => {
    console.log('🛑 stopLoading called')
    setIsLoading(false)
    setShowSpinner(false)

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    console.log('Spinner hidden immediately')
  }, [])

  const startLoading = useCallback(() => {
    console.log('🔄 startLoading called')
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Forcer la réinitialisation pour s'assurer que le spinner se déclenche
    setShowSpinner(false)
    setIsLoading(true)
    setShowSpinner(true)
    console.log('Spinner forced to show')

    // Auto-timeout après 10 secondes pour éviter que le spinner reste bloqué
    timeoutRef.current = setTimeout(() => {
      console.warn('⚠️ Loading timeout - forcing stop after 10s')
      stopLoading()
    }, 10000)
  }, [stopLoading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Force stop loading when component unmounts
      setIsLoading(false)
      setShowSpinner(false)
    }
  }, [])

  return {
    isLoading,
    showSpinner,
    startLoading,
    stopLoading
  }
}
