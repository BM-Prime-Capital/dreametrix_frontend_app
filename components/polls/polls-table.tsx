"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// This would typically come from your API
const classes = [
  {
    id: 1,
    name: "Class 5 - Sci",
    subject: "Science",
    grade: "Grade 5",
    teacher: "Samantha Brown",
    status: "done",
  },
  {
    id: 2,
    name: "Class 5 - Math",
    subject: "Mathematics",
    grade: "Grade 5",
    teacher: "Joe Smith",
    status: "pending",
  },
  // Add more sample data...
];

export function PollsTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SUBJECT</TableHead>
            <TableHead>CLASS</TableHead>
            <TableHead>CONTENT</TableHead>
            <TableHead>PROGRAM TO</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((class_, index) => (
            <TableRow key={class_.id}>
              <TableCell>{class_.subject}</TableCell>
              <TableCell>{class_.name}</TableCell>
              <TableCell>file.pdf</TableCell>
              <TableCell className="text-center">11/03</TableCell>

              <TableCell>
                <span
                  className={`text-white font-bold px-2 rounded-sm ${
                    class_.status === "done" ? "bg-green-500" : " bg-yellow-500"
                  }`}
                >
                  {class_.status}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4 text-sky-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4 text-green-500" />
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
