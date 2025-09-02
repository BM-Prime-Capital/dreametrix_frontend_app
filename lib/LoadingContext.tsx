"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { useSmartLoading } from '@/hooks/useSmartLoading'

interface LoadingContextType {
  startLoading: () => void
  stopLoading: () => void
  isLoading: boolean
  showSpinner: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, showSpinner, startLoading, stopLoading } = useSmartLoading()

  return (
    <LoadingContext.Provider value={{
      startLoading,
      stopLoading,
      isLoading,
      showSpinner
    }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
