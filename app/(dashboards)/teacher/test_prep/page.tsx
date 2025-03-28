"use client"

import TestPrep from "@/components/test_prep/TestPrep"
import TestQuestion from "@/components/test_prep/TestQuestion"
import { useState, useEffect } from "react"

export default function TestPrepPage() {
  const [showQuestion, setShowQuestion] = useState(false)

  // Debug: Log state changes
  useEffect(() => {
    console.log("State changed - showQuestion:", showQuestion)
  }, [showQuestion])

  const handleStartTest = () => {
    console.log("Starting test...")
    setShowQuestion(true)
  }

  const handleBack = () => {
    console.log("Going back to test prep...")
    setShowQuestion(false)
  }

  console.log("Rendering page component, showQuestion:", showQuestion)

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {showQuestion ? (
        <div className="w-full">
          <TestQuestion onBack={handleBack} />
        </div>
      ) : (
        <TestPrep onStartTest={handleStartTest} />
      )}
    </div>
  )
}

