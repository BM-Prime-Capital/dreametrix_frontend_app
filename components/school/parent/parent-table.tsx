"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample data - would typically come from your API
const teachers = [
  {
    id: 1,
    name: "Samantha Brown",
    department: "Science",
    status: "Active",
    classes: ["Class 5 - Sci", "Class 6 - Sci"],
    students: 30,
  },
  {
    id: 2,
    name: "Joe Smith",
    department: "Mathematics",
    status: "Active",
    classes: ["Class 5 - Math", "Class 7 - Math"],
    students: 45,
  },
  {
    id: 3,
    name: "Parker Monroe",
    department: "English",
    status: "On Leave",
    classes: ["Class 6 - Eng"],
    students: 25,
  },
  // Add more sample data as needed
]

export function TeachersTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>TEACHER</TableHead>
            <TableHead>DEPARTMENT</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>CLASSES</TableHead>
            <TableHead>STUDENTS</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher, index) => (
            <TableRow key={teacher.id} className={index % 2 === 0 ? "bg-sky-50/50" : ""}>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.department}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    teacher.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {teacher.status}
                </span>
              </TableCell>
              <TableCell>{teacher.classes.join(", ")}</TableCell>
              <TableCell>{teacher.students}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4 text-sky-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4 text-sky-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

