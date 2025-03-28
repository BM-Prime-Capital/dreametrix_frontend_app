"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Bookmark,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Eraser,
  HelpCircle,
  ImageIcon,
  Lightbulb,
  Maximize,
  Palette,
  PenTool,
  Ruler,
  Send,
  TextCursor,
  Timer,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface TestQuestionProps {
  onBack: () => void
}

export default function TestQuestion({ onBack }: TestQuestionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  // Sample text-based math questions
  const questions = [
    {
      id: 1,
      question:
        "A farmer places beehives containing bees in her orchard to pollinate the plants. The table below shows the ratio of the number of beehives to the number of acres in the orchard.\n\nBEEHIVES PER ACRE\nNumber of Beehives: 3, 9, 12, 18\nNumber of Acres: 8, 24, 32, ?\n\nIf the bees pollinate the plants at a constant rate, how many acres will be pollinated by the bees in 18 beehives?",
      options: ["38", "40", "44", "48"],
    },
    {
      id: 2,
      question:
        "Jake takes guitar lessons that cost $120.00 per month. Which equation can be used to determine the total number of dollars, d, that Jake pays for lessons for any number of months, m?",
      options: ["d = 120m", "d = 120 + m", "d = 120/m", "d = 120 × m"],
    },
    {
      id: 3,
      question: "Solve for x: 3x + 7 = 22",
      options: ["x = 3", "x = 5", "x = 7", "x = 15"],
    },
    {
      id: 4,
      question: "A rectangle has a length of 12 cm and a width of 8 cm. What is the area of the rectangle?",
      options: ["20 cm²", "40 cm²", "96 cm²", "120 cm²"],
    },
    {
      id: 5,
      question: "If 3/4 of a number is 18, what is the number?",
      options: ["13.5", "21", "24", "27"],
    },
  ]

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b w-full bg-gradient-to-r from-blue-50 to-indigo-50">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-100"
        >
          <ArrowLeft size={20} />
          <span>Return to Test Prep</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Timer size={16} className="text-gray-500" />
            <span>Time remaining: 45:00</span>
          </div>
          <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
            <HelpCircle size={18} className="mr-2" />
            Help
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Send size={18} className="mr-2" />
            Submit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 w-full max-w-5xl mx-auto">
        <div className="w-full mx-auto bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-gray-800">
              Question {questions[currentQuestion].id} of {questions.length}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                <Bookmark size={18} className="mr-1" />
                Save
              </Button>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <p className="text-lg whitespace-pre-line">{questions[currentQuestion].question}</p>
          </div>

          {/* Multiple Choice */}
          <div className="space-y-3 mt-4 mb-8">
            {questions[currentQuestion].options.map((option, index) => {
              const labels = ["A", "B", "C", "D"]
              return (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    selectedAnswer === option
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedAnswer(option)}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      selectedAnswer === option ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {labels[index]}
                  </div>
                  <span className="text-lg">{option}</span>
                </label>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 border-t pt-6">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-5 py-2 h-auto text-indigo-700 border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
              Previous Question
            </Button>

            <div className="flex items-center gap-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full mx-0.5 ${
                    currentQuestion === index ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className="flex items-center gap-2 px-5 py-2 h-auto bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 border-0"
            >
              Next Question
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tools Footer - Redesigned */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 w-full">
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { icon: <Lightbulb size={20} />, label: "Hint", color: "bg-amber-500" },
            { icon: <TextCursor size={20} />, label: "Line Reader", color: "bg-blue-500" },
            { icon: <Calculator size={20} />, label: "Calculator", color: "bg-purple-500" },
            { icon: <Palette size={20} />, label: "Highlighter", color: "bg-green-500" },
            { icon: <Eraser size={20} />, label: "Eraser", color: "bg-red-500" },
            { icon: <Ruler size={20} />, label: "Ruler", color: "bg-teal-500" },
            { icon: <PenTool size={20} />, label: "Notes", color: "bg-indigo-500" },
            { icon: <ImageIcon size={20} />, label: "Reference", color: "bg-pink-500" },
            { icon: <Maximize size={20} />, label: "Fullscreen", color: "bg-gray-500" },
          ].map((tool, index) => (
            <Button
              key={index}
              variant="ghost"
              className="text-white hover:bg-white/10 flex flex-col items-center gap-1 p-2 rounded-lg"
            >
              <div className={`${tool.color} p-2 rounded-full`}>{tool.icon}</div>
              <span className="text-xs font-medium">{tool.label}</span>
            </Button>
          ))}
        </div>
      </footer>
    </div>
  )
}

