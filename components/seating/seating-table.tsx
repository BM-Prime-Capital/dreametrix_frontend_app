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

export function SeatingTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STUDENT</TableHead>
            <TableHead>AVERAGE</TableHead>
            <TableHead>EXAM(3)</TableHead>
            <TableHead>TEST(2)</TableHead>
            <TableHead>ASSIGNMENTS(14)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((class_, index) => (
            <TableRow key={class_.id}>
              <TableCell>{class_.name}</TableCell>
              <TableCell>{class_.subject}</TableCell>
              <TableCell>{class_.grade}</TableCell>
              <TableCell>{class_.teacher}</TableCell>
              <TableCell>{class_.students}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
