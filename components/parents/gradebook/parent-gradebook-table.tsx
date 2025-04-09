"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExamsDialog } from "./exam-dialog"
import { ExamDetailDialog } from "./exam-detail-dialog"
import { ClassDialog } from "./class-dialog"
import { StudentDialog } from "./student-dialog"

// Define proper types for our data
interface Exam {
  id: number
  score: string
  date: string
  title: string
}


interface ClassData {
  id: number
  class: string
  student: string
  average: string
  exams: Exam[]
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

// Sample gradebook data
const gradebookData: ClassData[] = [
  {
    id: 1,
    class: "Class 5 - Sci",
    student: "John Smith",
    average: "85% (B)",
    exams: [
      { id: 1, score: "87%", date: "03/15/2023", title: "Midterm Exam" },
      { id: 2, score: "85%", date: "04/20/2023", title: "Chapter 7 Test" },
      { id: 3, score: "93%", date: "05/25/2023", title: "Final Exam" },
    ],
    tests: {
      count: 2,
      average: "84%"
    },
    assignments: {
      count: 14,
      average: "88%",
      completed: 12
    },
    teacher: "Eva Parker",
    trend: "down",
  },
  {
    id: 2,
    class: "Class 5 - Math",
    student: "John Smith",
    average: "95% (A)",
    exams: [
      { id: 1, score: "97%", date: "03/10/2023", title: "Midterm Exam" },
      { id: 2, score: "93%", date: "04/15/2023", title: "Chapter 8 Test" },
      { id: 3, score: "95%", date: "05/20/2023", title: "Final Exam" },
    ],
    tests: {
      count: 2,
      average: "96%"
    },
    assignments: {
      count: 14,
      average: "94%",
      completed: 14
    },
    teacher: "Eva Parker",
    trend: "up",
  },
  {
    id: 3,
    class: "Class 5 - Bio",
    student: "John Smith",
    average: "78% (C+)",
    exams: [
      { id: 1, score: "77%", date: "03/12/2023", title: "Midterm Exam" },
      { id: 2, score: "75%", date: "04/17/2023", title: "Chapter 6 Test" },
      { id: 3, score: "83%", date: "05/22/2023", title: "Final Exam" },
    ],
    tests: {
      count: 2,
      average: "79%"
    },
    assignments: {
      count: 14,
      average: "76%",
      completed: 11
    },
    teacher: "Sam Burke",
    trend: "stable",
  },
  {
    id: 4,
    class: "Class 3 - Lit",
    student: "Emma Smith",
    average: "91% (A-)",
    exams: [
      { id: 1, score: "93%", date: "03/14/2023", title: "Midterm Exam" },
      { id: 2, score: "89%", date: "04/19/2023", title: "Chapter 5 Test" },
      { id: 3, score: "92%", date: "05/24/2023", title: "Final Exam" },
    ],
    tests: {
      count: 2,
      average: "90%"
    },
    assignments: {
      count: 14,
      average: "92%",
      completed: 14
    },
    teacher: "Anna Blake",
    trend: "up",
  },
  {
    id: 5,
    class: "Class 3 - Che",
    student: "Emma Smith",
    average: "82% (B-)",
    exams: [
      { id: 1, score: "80%", date: "03/16/2023", title: "Midterm Exam" },
      { id: 2, score: "82%", date: "04/21/2023", title: "Chapter 9 Test" },
      { id: 3, score: "84%", date: "05/26/2023", title: "Final Exam" },
    ],
    tests: {
      count: 2,
      average: "81%"
    },
    assignments: {
      count: 14,
      average: "84%",
      completed: 12
    },
    teacher: "Sam Burke",
    trend: "up",
  },
  {
    id: 6,
    class: "Class 3 - Spa",
    student: "Emma Smith",
    average: "88% (B+)",
    exams: [
      { id: 1, score: "87%", date: "03/11/2023", title: "Midterm Exam" },
      { id: 2, score: "88%", date: "04/16/2023", title: "Chapter 4 Test" },
      { id: 3, score: "89%", date: "05/21/2023", title: "Final Exam" },
    ],
    tests: {
      count: 2,
      average: "87%"
    },
    assignments: {
      count: 14,
      average: "89%",
      completed: 13
    },
    teacher: "Anna Blake",
    trend: "stable",
  },
  {
    id: 7,
    class: "Class 5 - Phy",
    student: "John Smith",
    average: "75% (C)",
    exams: [
      { id: 1, score: "73%", date: "03/13/2023", title: "Midterm Exam" },
      { id: 2, score: "75%", date: "04/18/2023", title: "Chapter 10 Test" },
      { id: 3, score: "77%", date: "05/23/2023", title: "Final Exam" },
    ],
    tests: {
      count: 2,
      average: "74%"
    },
    assignments: {
      count: 14,
      average: "76%",
      completed: 10
    },
    teacher: "Eva Parker",
    trend: "up",
  },
]

interface ParentGradebookTableProps {
  selectedStudent: string
  selectedClass: string
}

export function ParentGradebookTable({ selectedStudent, selectedClass }: ParentGradebookTableProps) {
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false)
  const [isExamDetailModalOpen, setIsExamDetailModalOpen] = useState(false)
  const [isClassModalOpen, setIsClassModalOpen] = useState(false)
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [selectedClassData, setSelectedClassData] = useState<ClassData | null>(null)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)

  const handleExamsClick = (classData: ClassData) => {
    setSelectedClassData(classData)
    setIsExamsModalOpen(true)
  }

  const handleExamClick = (exam: Exam) => {
    setSelectedExam(exam)
    setIsExamDetailModalOpen(true)
  }

  const handleClassClick = (classData: ClassData) => {
    setSelectedClassData(classData)
    setIsClassModalOpen(true)
  }

  const handleStudentClick = (classData: ClassData) => {
    setSelectedClassData(classData)
    setIsStudentModalOpen(true)
  }

  // Filter gradebook data based on selected student and class
  const filteredData = gradebookData.filter((item) => {
    const studentMatch = 
      selectedStudent === "all-students" || 
      (selectedStudent === "john" && item.student === "John Smith") ||
      (selectedStudent === "emma" && item.student === "Emma Smith")
    
    const classMatch = 
      selectedClass === "all-classes" || 
      item.class.toLowerCase().replace(/\s/g, "-") === selectedClass
    
    return studentMatch && classMatch
  })

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">STUDENT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">AVERAGE</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">EXAM (3)</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TESTS (2)</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">ASSIGNMENTS (14)</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((classData, index) => (
            <TableRow key={classData.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">
                <div
                  className="cursor-pointer flex items-center"
                  onClick={() => handleStudentClick(classData)}
                >
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {classData.student}
                  </Badge>
                </div>
              </TableCell>
              <TableCell 
                className="font-medium text-gray-500 cursor-pointer"
                onClick={() => handleClassClick(classData)}
              >
                {classData.class}
              </TableCell>
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

      {selectedClassData && (
        <>
          <ExamsDialog
            isOpen={isExamsModalOpen}
            onClose={() => setIsExamsModalOpen(false)}
            classData={selectedClassData}
            onExamClick={handleExamClick}
          />

          <ClassDialog
            isOpen={isClassModalOpen}
            onClose={() => setIsClassModalOpen(false)}
            classData={selectedClassData}
          />

          <StudentDialog
            isOpen={isStudentModalOpen}
            onClose={() => setIsStudentModalOpen(false)}
            studentData={selectedClassData}
          />

          {selectedExam && (
            <ExamDetailDialog
              isOpen={isExamDetailModalOpen}
              onClose={() => setIsExamDetailModalOpen(false)}
              exam={selectedExam}
              classData={selectedClassData}
            />
          )}
        </>
      )}

      {(isExamsModalOpen || isExamDetailModalOpen || isClassModalOpen || isStudentModalOpen) && 
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      }
    </div>
  )
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-green-500 ml-1"
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

  if (trend === "down") {
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
        d="M5 12H19"
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