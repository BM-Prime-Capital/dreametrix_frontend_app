"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClassStudentsDialog from "./ClassStudentsDialog";
import ClassStudentsPopUp from "./StudentClassesDialog";

// This would typically come from your API
const classes = [
  {
    id: 1,
    name: "Class 5 - Sci",
    subject: "Science",
    grade: "Grade 5",
    teacher: "Samantha Brown",
    students: 15,
  },
  {
    id: 2,
    name: "Class 5 - Math",
    subject: "Mathematics",
    grade: "Grade 5",
    teacher: "Joe Smith",
    students: 15,
  },
  // Add more sample data...
];

export function ClassesTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CLASS</TableHead>
            <TableHead>SUBJECT</TableHead>
            <TableHead>GRADE</TableHead>
            <TableHead>TEACHER</TableHead>
            <TableHead>STUDENTS</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((class_, index) => (
            <TableRow
              key={class_.id}
              className={index % 2 === 0 ? "bg-sky-50/50" : ""}
            >
              <TableCell>{class_.name}</TableCell>
              <TableCell>{class_.subject}</TableCell>
              <TableCell>{class_.grade}</TableCell>
              <TableCell>{class_.teacher}</TableCell>
              <TableCell className="flex items-center">
                {class_.students}
                <ClassStudentsDialog studentClassName={class_.name} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
  );
}
