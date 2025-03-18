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

export function GradebookTable({
  classes,
  setCurrentClass,
}: {
  classes: any[];
  setCurrentClass: Function;
}) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((class_, index) => (
            <TableRow
              key={class_.id}
              className={"cursor-pointer"}
              onClick={() => setCurrentClass(class_)}
            >
              <TableCell>{class_.name}</TableCell>
              <TableCell>{class_.average}</TableCell>
              <TableCell>{class_.noOfExams}</TableCell>
              <TableCell>{class_.noOfTests}</TableCell>
              <TableCell>{class_.noOfHomeworks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
