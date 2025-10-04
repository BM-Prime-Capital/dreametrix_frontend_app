"use client"

import { useState, useEffect, useRef } from 'react'

export function useSmartLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  const startLoading = () => {
    console.log('🔄 startLoading called')
    // Forcer la réinitialisation pour s'assurer que le spinner se déclenche
    setShowSpinner(false)
    setIsLoading(true)
    setShowSpinner(true)
    console.log('Spinner forced to show')
  }

  const stopLoading = () => {
    console.log('🛑 stopLoading called')
    setIsLoading(false)
    setShowSpinner(false)
    console.log('Spinner hidden immediately')
  }

  return {
    isLoading,
    showSpinner,
    startLoading,
    stopLoading
  }
}
