"use client"

import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export function LoadingOverlay({ isVisible, message = "Loading..." }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="text-center">
          {/* Spinner principal */}
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            {/* Cercle externe animé */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-[#25AAE1]/20 rounded-full mx-auto animate-ping"></div>
          </div>
          
          {/* Message de chargement */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading</h3>
          <p className="text-gray-600 text-sm">{message}</p>
          
          {/* Points de chargement animés */}
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-2 h-2 bg-[#25AAE1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#25AAE1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#25AAE1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
