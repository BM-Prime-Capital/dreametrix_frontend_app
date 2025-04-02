'use client'
import { useState, useEffect } from "react"
import TestPrep from "@/components/test_prep/TestPrep"
import TestQuestion from "@/components/test_prep/TestQuestion"
import { Question } from "@/components/types/question"

export default function TestPrepPage() {
  const [showQuestion, setShowQuestion] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])

  // Debug: Log state changes
  useEffect(() => {
    console.log("State changed - showQuestion:", showQuestion)
  }, [showQuestion])

  const handleStartTest = (questions: Question[]) => {
    console.log("Starting test...", questions)
    setQuestions(questions)
    setShowQuestion(true)
  }

  const handleBack = () => {
    console.log("Going back to test prep...")
    setShowQuestion(false)
    setQuestions([])
  }

  console.log("Rendering page component, showQuestion:", showQuestion)

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {showQuestion ? (
        <div className="w-full">
          <TestQuestion onBack={handleBack} questions={questions} />
        </div>
      ) : (
        <TestPrep onStartTest={handleStartTest} />
      )}
    </div>
  )
}