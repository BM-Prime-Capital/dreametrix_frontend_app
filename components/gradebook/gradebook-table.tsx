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
import { ClassData, ClassType } from "../types/gradebook";





interface GradebookTableProps {
  classes: ClassData[];
  onClassSelect: (selectedClass: ClassData) => void; // Nom cohérent
}


export function GradebookTable({ classes, onClassSelect }: GradebookTableProps) {
  
  return (
    <div className="w-full overflow-auto text-center">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">CLASS</TableHead>
            <TableHead className="text-center">AVERAGE</TableHead>
            <TableHead className="text-center">NUMBER OF EXAMS</TableHead>
            <TableHead className="text-center">NUMBER OF TESTS</TableHead>
            <TableHead className="text-center">NUMBER OF HOMEWORKS</TableHead>
            <TableHead className="text-center">NUMBER OF PARTICIPATIONS</TableHead>
            <TableHead className="text-center">NUMBER OF OTHERS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((class_, index) => (
            <TableRow
            key={class_.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onClassSelect(class_)} // Utiliser le nouveau nom
            >
              <TableCell>{class_.name}</TableCell>
              <TableCell>{class_.average}</TableCell>
              <TableCell>{class_.noOfExams}</TableCell>
              <TableCell>{class_.noOfTests}</TableCell>
              <TableCell>{class_.noOfHomeworks}</TableCell>
              <TableCell>{class_.noOfParticipation}</TableCell>
              <TableCell>{class_.noOfOther}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
