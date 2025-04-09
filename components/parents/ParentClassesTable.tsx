"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SendMessageDialog } from "./SendMessageDialog"
import { Badge } from "@/components/ui/badge"

// Sample class data
const classesData = [
  {
    id: 1,
    name: "Class 5 - Sci",
    subject: "Science",
    teacher: "Eva Parker",
    dayTime: ["Monday 8 AM", "Fridays 12:15 AM"],
    student: "John Smith",
  },
  {
    id: 2,
    name: "Class 5 - Math",
    subject: "Mathematics",
    teacher: "Eva Parker",
    dayTime: ["Monday 8 AM", "Fridays 11:15 AM"],
    student: "John Smith",
  },
  {
    id: 3,
    name: "Class 5 - Bio",
    subject: "Biology",
    teacher: "Sam Burke",
    dayTime: ["Thursday 8 am"],
    student: "John Smith",
  },
  {
    id: 4,
    name: "Class 3 - Lit",
    subject: "Literature",
    teacher: "Anna Blake",
    dayTime: ["Thursday 12 am"],
    student: "Emma Smith",
  },
  {
    id: 5,
    name: "Class 3 - Che",
    subject: "Chemistry",
    teacher: "Sam Burke",
    dayTime: ["Wednesday 8 am"],
    student: "Emma Smith",
  },
  {
    id: 6,
    name: "Class 3 - Spa",
    subject: "Spanish",
    teacher: "Anna Blake",
    dayTime: ["Wednesday 11:15 am"],
    student: "Emma Smith",
  },
  {
    id: 7,
    name: "Class 5 - Phy",
    subject: "Physics",
    teacher: "Eva Parker",
    dayTime: ["Tuesday 11:15 am", "Wednesday 11:15 am"],
    student: "John Smith",
  },
]

interface ParentClassesTableProps {
  selectedChild: string
}

export function ParentClassesTable({ selectedChild }: ParentClassesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState("")

  const handleTeacherClick = (teacher: string) => {
    setSelectedTeacher(teacher)
    setIsModalOpen(true)
  }

  // Filter classes based on selected child
  const filteredClasses =
    selectedChild === "all"
      ? classesData
      : classesData.filter((cls) => {
          if (selectedChild === "john") return cls.student === "John Smith"
          if (selectedChild === "emma") return cls.student === "Emma Smith"
          return true
        })

  return (
    <div className="w-full relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">SUBJECT</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
            <TableHead className="font-bold text-gray-700 py-4">DAY & TIME</TableHead>
            {selectedChild === "all" && <TableHead className="font-bold text-gray-700 py-4">STUDENT</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClasses.map((class_, index) => (
            <TableRow key={class_.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
              <TableCell className="font-medium text-gray-500">{class_.name}</TableCell>
              <TableCell className="text-gray-500">{class_.subject}</TableCell>
              <TableCell className="text-gray-500">
                <div className="flex items-center cursor-pointer" onClick={() => handleTeacherClick(class_.teacher)}>
                  {class_.teacher} <MessageIcon />
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                <div className="flex flex-col">
                  {class_.dayTime.map((time, i) => (
                    <span key={i}>{time}</span>
                  ))}
                </div>
              </TableCell>
              {selectedChild === "all" && (
                <TableCell className="text-gray-500">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {class_.student}
                  </Badge>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SendMessageDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} teacher={selectedTeacher} />

      {isModalOpen && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />}
    </div>
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
