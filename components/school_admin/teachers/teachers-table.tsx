"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// This would typically come from your API
const teachers = [
  {
    id: 1,
    name: "Samantha Brown",
    subjects: "Science - Mathematics",
    grades: "Grade 5",
    shift: "Morning",
  },
  {
    id: 2,
    name: "Joe Smith",
    subjects: "History - English",
    grades: "Grade 5 - 4 - 6",
    shift: "Afternoon",
  },
]

export function TeachersTable() {
  return (
    <div className="w-full overflow-auto rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>TEACHER</TableHead>
            <TableHead>SUBJECTS</TableHead>
            <TableHead>GRADES</TableHead>
            <TableHead>SHIFT</TableHead>
            <TableHead>VIEW MORE</TableHead>
            <TableHead>EDIT</TableHead>
            <TableHead>DELETE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher, index) => (
            <TableRow key={teacher.id} className={index % 2 === 0 ? "bg-sky-50/50" : ""}>
              <TableCell className="font-medium">{teacher.name}</TableCell>
              <TableCell>{teacher.subjects}</TableCell>
              <TableCell>{teacher.grades}</TableCell>
              <TableCell>{teacher.shift}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4 text-sky-500" />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4 text-sky-500" />
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