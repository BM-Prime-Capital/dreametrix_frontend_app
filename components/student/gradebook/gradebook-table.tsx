"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExamsDialog } from "./exams-dialog"
import { ExamDetailDialog } from "./exam-detail-dialog"

// Define proper types for our data
interface Exam {
  id: number
  score: string
}

interface ClassData {
  id: number
  class: string
  average: string
  exams: Exam[]
  tests: number
  assignments: number
  teacher: string
  trend: "up" | "down"
}

// Sample gradebook data
const gradebookData: ClassData[] = [
  {
    id: 1,
    class: "Class 5 - Sci",
    average: "85% (C)",
    exams: [
      { id: 1, score: "87%" },
      { id: 2, score: "85%" },
      { id: 3, score: "93%" },
    ],
    tests: 2,
    assignments: 14,
    teacher: "Eva Parker",
    trend: "down",
  },
  {
    id: 2,
    class: "Class 5 - Math",
    average: "100% (A)",
    exams: [
      { id: 1, score: "100%" },
      { id: 2, score: "100%" },
      { id: 3, score: "100%" },
    ],
    tests: 2,
    assignments: 14,
    teacher: "Eva Parker",
    trend: "up",
  },
  {
    id: 3,
    class: "Class 5 - Bio",
    average: "85% (C)",
    exams: [
      { id: 1, score: "87%" },
      { id: 2, score: "85%" },
      { id: 3, score: "93%" },
    ],
    tests: 2,
    assignments: 14,
    teacher: "Sam Burke",
    trend: "down",
  },
  {
    id: 4,
    class: "Class 5 - Lit",
    average: "85% (C)",
    exams: [
      { id: 1, score: "87%" },
      { id: 2, score: "85%" },
      { id: 3, score: "93%" },
    ],
    tests: 2,
    assignments: 14,
    teacher: "Anna Blake",
    trend: "down",
  },
  {
    id: 5,
    class: "Class 5 - Che",
    average: "85% (C)",
    exams: [
      { id: 1, score: "87%" },
      { id: 2, score: "85%" },
      { id: 3, score: "93%" },
    ],
    tests: 2,
    assignments: 14,
    teacher: "Sam Burke",
    trend: "down",
  },
  {
    id: 6,
    class: "Class 5 - Spa",
    average: "85% (C)",
    exams: [
      { id: 1, score: "87%" },
      { id: 2, score: "85%" },
      { id: 3, score: "93%" },
    ],
    tests: 2,
    assignments: 14,
    teacher: "Anna Blake",
    trend: "down",
  },
  {
    id: 7,
    class: "Class 5 - Phy",
    average: "85% (C)",
    exams: [
      { id: 1, score: "87%" },
      { id: 2, score: "85%" },
      { id: 3, score: "93%" },
    ],
    tests: 2,
    assignments: 14,
    teacher: "Eva Parker",
    trend: "down",
  },
]

export function GradebookTable() {
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false)
  const [isExamDetailModalOpen, setIsExamDetailModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)

  const handleExamsClick = (classData: ClassData) => {
    setSelectedClass(classData)
    setIsExamsModalOpen(true)
  }

  const handleExamClick = (exam: Exam) => {
    setSelectedExam(exam)
    setIsExamDetailModalOpen(true)
  }

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">AVERAGE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">EXAM (3)</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TESTS(2)</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">ASSIGNMENTS(14)</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gradebookData.map((classData, index) => (
            <TableRow key={classData.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">{classData.class}</TableCell>
              <TableCell className="text-gray-500">{classData.average}</TableCell>
              <TableCell>
                <button
                  className="text-[#25AAE1] hover:underline flex items-center"
                  onClick={() => handleExamsClick(classData)}
                >
                  View
                  <TrendIcon trend={classData.trend} />
                </button>
              </TableCell>
              <TableCell>
                <button className="text-[#25AAE1] hover:underline flex items-center">
                  View
                  <TrendIcon trend={classData.trend} />
                </button>
              </TableCell>
              <TableCell>
                <button className="text-[#25AAE1] hover:underline flex items-center">
                  View
                  <TrendIcon trend={classData.trend} />
                </button>
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex items-center">
                  {classData.teacher} <MessageIcon />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedClass && (
        <>
          <ExamsDialog
            isOpen={isExamsModalOpen}
            onClose={() => setIsExamsModalOpen(false)}
            classData={selectedClass}
            onExamClick={handleExamClick}
          />

          {selectedExam && (
            <ExamDetailDialog
              isOpen={isExamDetailModalOpen}
              onClose={() => setIsExamDetailModalOpen(false)}
              exam={selectedExam}
              exams={selectedClass.exams}
            />
          )}
        </>
      )}

      {(isExamsModalOpen || isExamDetailModalOpen) && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />}
    </div>
  )
}

function TrendIcon({ trend }: { trend: "up" | "down" }) {
  if (trend === "up") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-500 ml-1"
      >
        <path
          d="M12 19V5M12 5L5 12M12 5L19 12"
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
      className="text-red-500 ml-1"
    >
      <path
        d="M12 5V19M12 19L5 12M12 19L19 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#25AAE1] ml-2"
    >
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

