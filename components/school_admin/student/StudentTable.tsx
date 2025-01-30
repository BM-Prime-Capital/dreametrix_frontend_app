"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const students = [
  {
    id: 1,
    name: "Taylor Brown",
    status: "Paid",
    grade: "Grade 5",
    shift: "Morning",
  },
  {
    id: 2,
    name: "Arnold Smith",
    status: "Paid",
    grade: "Grade 5",
    shift: "Afternoon",
  },
  {
    id: 3,
    name: "Samantha Monroe",
    status: "Debt",
    grade: "Grade 6",
    shift: "Afternoon",
  },
  {
    id: 4,
    name: "Susan O'Connor",
    status: "Paid",
    grade: "Grade 7",
    shift: "Morning",
  },
  {
    id: 5,
    name: "Ben Patterson",
    status: "Debt",
    grade: "Grade 8",
    shift: "Morning",
  },
  {
    id: 6,
    name: "Steve Davis",
    status: "Paid",
    grade: "Grade 7",
    shift: "Afternoon",
  },
  {
    id: 7,
    name: "Malcolm Jones",
    status: "Paid",
    grade: "Grade 9",
    shift: "Morning",
  },
]

export function StudentsTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STUDENT</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>GRADE</TableHead>
            <TableHead>SHIFT</TableHead>
            <TableHead>VIEW MORE</TableHead>
            <TableHead>EDIT</TableHead>
            <TableHead>DELETE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.id} className={index % 2 === 0 ? "bg-sky-50/50" : ""}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    student.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {student.status}
                </span>
              </TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell>{student.shift}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4 text-blue-500" />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4 text-blue-500" />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}