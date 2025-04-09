"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Book, FileText, Sparkles, TrendingUp } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

interface ClassData {
  id: number
  class: string
  student: string
  average: string
  exams: {
    id: number
    score: string
    date: string
    title: string
  }[]
  tests: {
    count: number
    average: string
  }
  assignments: {
    count: number
    average: string
    completed: number
  }
  teacher: string
  trend: "up" | "down" | "stable"
}

interface StudentDialogProps {
  isOpen: boolean
  onClose: () => void
  studentData: ClassData
}

export function StudentDialog({ isOpen, onClose, studentData }: StudentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-medium">{studentData.student}</div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t pt-4 mb-4" />

          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{studentData.student.charAt(0)}</span>
            </div>
            <div className="ml-4">
              <div className="text-xl font-medium">{studentData.student}</div>
              <div className="text-gray-500">Grade 5</div>
              <div className="text-gray-500">ID: 0366ANH55</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Book className="h-5 w-5 text-blue-600 mr-2" />
                <div className="font-medium">Current Class</div>
              </div>
              <div className="text-lg font-bold">{studentData.class}</div>
              <div className="text-gray-600">Teacher: {studentData.teacher}</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 text-green-600 mr-2" />
                <div className="font-medium">Overall Performance</div>
              </div>
              <div className="text-lg font-bold">{studentData.average}</div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">Trend:</span>
                <TrendIcon trend={studentData.trend} />
                <span className="text-sm ml-1">
                  {studentData.trend === "up" ? "Improving" : 
                   studentData.trend === "down" ? "Declining" : "Stable"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="font-medium mb-4">Performance Breakdown</div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-600">Exams ({studentData.exams.length})</div>
                  <div className="text-sm font-medium">
                    {studentData.exams.reduce((acc, exam) => 
                      acc + parseInt(exam.score.replace('%', '')), 0) / studentData.exams.length}%
                  </div>
                </div>
                <Progress 
                  value={studentData.exams.reduce((acc, exam) => 
                    acc + parseInt(exam.score.replace('%', '')), 0) / studentData.exams.length} 
                  className="h-2 bg-gray-200" 
                 
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-600">Tests ({studentData.tests.count})</div>
                  <div className="text-sm font-medium">{studentData.tests.average}</div>
                </div>
                <Progress 
                  value={parseInt(studentData.tests.average.replace('%', ''))} 
                  className="h-2 bg-gray-200" 
                 
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-600">
                    Assignments ({studentData.assignments.completed}/{studentData.assignments.count})
                  </div>
                  <div className="text-sm font-medium">{studentData.assignments.average}</div>
                </div>
                <Progress 
                  value={parseInt(studentData.assignments.average.replace('%', ''))} 
                  className="h-2 bg-gray-200" 
                 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" className="bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Full Report
            </Button>
            <Button className="bg-[#B066F2] hover:bg-[#9A4DD9] text-white">
              View All Classes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return (
      <TrendingUp className="h-4 w-4 text-green-500" />
    )
  }

  if (trend === "down") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-red-500"
      >
        <path
          d="M23 18L13.5 8.5L8.5 13.5L1 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 18H23V12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-500"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
