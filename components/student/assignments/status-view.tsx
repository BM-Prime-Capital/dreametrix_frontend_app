"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileIcon, CheckCircle, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

// Sample assignments data
const statusAssignments = [
  {
    id: 1,
    class: "Class 5 - Sci",
    day: "TODAY",
    type: "Homework",
    status: "completed",
    teacher: "Eva Parker",
  },
  {
    id: 2,
    class: "Class 5 - Math",
    day: "11:21",
    type: "Test",
    status: "incomplete",
    teacher: "Eva Parker",
  },
  {
    id: 3,
    class: "Class 5 - Bio",
    day: "11:25",
    type: "Homework",
    status: "incomplete",
    teacher: "Sam Burke",
  },
  {
    id: 4,
    class: "Class 5 - Lit",
    day: "11:25",
    type: "Homework",
    status: "completed",
    teacher: "Anna Blake",
  },
  {
    id: 5,
    class: "Class 5 - Che",
    day: "11:29",
    type: "Test",
    status: "incomplete",
    teacher: "Sam Burke",
  },
  {
    id: 6,
    class: "Class 5 - Spa",
    day: "12:05",
    type: "Test",
    status: "incomplete",
    teacher: "Anna Blake",
  },
  {
    id: 7,
    class: "Class 5 - Phy",
    day: "12:05",
    type: "Test",
    status: "incomplete",
    teacher: "Eva Parker",
  },
]

export function StatusView() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")

  return (
    <section className="flex flex-col gap-4 w-full max-w-5xl mx-auto p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-[#4CAF50] text-xl font-bold">ASSIGNMENTS</h1>
        <div className="flex gap-4">
          <button className="bg-white border rounded-md px-4 py-2 flex items-center justify-center">
            <span>All Days</span>
            <Calendar className="ml-2 h-5 w-5 text-gray-500" />
          </button>

          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-classes">All Classes</SelectItem>
              <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
              <SelectItem value="class-n-1">Class N</SelectItem>
              <SelectItem value="class-n-2">Class N</SelectItem>
              <SelectItem value="class-n-3">Class N</SelectItem>
              <SelectItem value="class-n-4">Class N</SelectItem>
              <SelectItem value="class-n-5">Class N</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="font-bold text-gray-700 py-4">CLASS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4">DAY</TableHead>
              <TableHead className="font-bold text-gray-700 py-4">TYPE</TableHead>
              <TableHead className="font-bold text-gray-700 py-4">FILES</TableHead>
              <TableHead className="font-bold text-gray-700 py-4">STATUS</TableHead>
              <TableHead className="font-bold text-gray-700 py-4">TEACHER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statusAssignments.map((assignment, index) => (
              <TableRow key={assignment.id} className={index % 2 === 0 ? "bg-[#EDF6FA]" : ""}>
                <TableCell className="font-medium text-gray-500">{assignment.class}</TableCell>
                <TableCell className="text-gray-500">
                  <span
                    className={
                      assignment.day === "TODAY"
                        ? "text-[#25AAE1] underline"
                        : assignment.day === "YESTERDAY"
                          ? "text-orange-400 underline"
                          : ""
                    }
                  >
                    {assignment.day}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500">{assignment.type}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <FileIcon className="h-5 w-5 text-[#25AAE1]" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {assignment.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">
                  <div className="flex items-center">
                    {assignment.teacher} <MessageIcon />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
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

