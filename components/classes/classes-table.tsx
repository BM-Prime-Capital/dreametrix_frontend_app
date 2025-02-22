"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample class data
const classes = [
  {
    id: 1,
    name: "Class 5N",
    subject: "Science",
    grade: "Grade 5",
    teacher: "Samantha Brown",
    students: 15,
  },
  {
    id: 2,
    name: "Class 5M",
    subject: "Mathematics",
    grade: "Grade 5",
    teacher: "Joe Smith",
    students: 15,
  },
]

export function ClassesTable() {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-bold">CLASS</TableHead>
            <TableHead className="font-bold">SUBJECT</TableHead>
            <TableHead className="font-bold">GRADE</TableHead>
            <TableHead className="font-bold">TEACHER</TableHead>
            <TableHead className="font-bold">STUDENTS</TableHead>
            <TableHead>EDIT</TableHead>
            <TableHead>DELETE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((class_, index) => (
            <TableRow
              key={class_.id}
              className={`
                ${index % 2 === 0 ? "bg-[#F8FBFF]" : "bg-white"}
                hover:bg-[#F8FBFF]/80
              `}
            >
              <TableCell className="font-medium">{class_.name}</TableCell>
              <TableCell>{class_.subject}</TableCell>
              <TableCell>{class_.grade}</TableCell>
              <TableCell>{class_.teacher}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {class_.students}
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                    <Eye className="h-4 w-4 text-[#25AAE1]" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                  <Pencil className="h-4 w-4 text-[#25AAE1]" />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50">
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

