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
import { generalImages } from "@/constants/images";
import Image from "next/image";
import AssignmentStudentsDialog from "./AssignmentStudentsDialog";

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

export function AssignmentsTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>TYPE</TableHead>
            <TableHead>AGV. SCORE</TableHead>
            <TableHead>GEN. FEEDBACK</TableHead>
            <TableHead>NO. OF SPECIFIC FEEDBACK</TableHead>
            <TableHead>STUDENTS</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((class_, index) => (
            <TableRow key={class_.id}>
              <TableCell>{class_.name}</TableCell>
              <TableCell>{class_.students}</TableCell>
              <TableCell>{class_.students}</TableCell>
              <TableCell>{class_.students}</TableCell>
              <TableCell className="flex items-center">
                {class_.students}
                <AssignmentStudentsDialog studentClassName={class_.name} />
              </TableCell>
              <TableCell>
                <span className="flex justify-center">
                  <Image
                    src={generalImages.status}
                    className="h-4 w-4 align-middle"
                    alt="status"
                    width={100}
                    height={100}
                  />
                </span>
              </TableCell>
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
  );
}
