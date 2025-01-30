"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const classes = [
  {
    id: 1,
    name: "Class 5 - Sci",
    subject: "Science",
    grade: "Grade 5",
    students: 15,
  },
  {
    id: 2,
    name: "Class 5 - Math",
    subject: "Mathematics",
    grade: "Grade 5",
    students: 15,
  },
  {
    id: 3,
    name: "Class 6 - Math",
    subject: "Mathematics",
    grade: "Grade 6",
    students: 15,
  },
  {
    id: 4,
    name: "Class 7 - Sci",
    subject: "Science",
    grade: "Grade 7",
    students: 15,
  },
  {
    id: 5,
    name: "Class 8 - Math",
    subject: "Mathematics",
    grade: "Grade 8",
    students: 15,
  },
  {
    id: 6,
    name: "Class 7 - Math",
    subject: "Mathematics",
    grade: "Grade 7",
    students: 15,
  },
  {
    id: 7,
    name: "Class 9 - Sci",
    subject: "Science",
    grade: "Grade 9",
    students: 15,
  },
]

export function ClassesTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CLASS</TableHead>
            <TableHead>SUBJECT</TableHead>
            <TableHead>GRADE</TableHead>
            <TableHead>STUDENTS</TableHead>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem, index) => (
            <TableRow key={classItem.id} className={index % 2 === 0 ? "bg-sky-50/50" : ""}>
              <TableCell className="font-medium">{classItem.name}</TableCell>
              <TableCell>{classItem.subject}</TableCell>
              <TableCell>{classItem.grade}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {classItem.students}
                  <Eye className="h-4 w-4 text-blue-500" />
                </div>
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