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
import { useList } from "@/hooks/useList";
import { getAssignments } from "@/services/AssignmentService";
import { Loader } from "../ui/loader";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import AssignmentStudentsDialog from "./AssignmentStudentsDialog";
import { Assignment } from "@/types";

export function AssignmentsTable() {
  const { list: assignments, isLoading, error } = useList(getAssignments);

  if (isLoading) return <Loader />;
  
  if (error) return (
    <div className="text-red-500 p-4">
      Error loading assignments: {error}
    </div>
  );

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>TYPE</TableHead>
            <TableHead>DUE DATE</TableHead>
            <TableHead>WEIGHT</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment: Assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">{assignment.name}</TableCell>
              <TableCell>{assignment.kind}</TableCell>
              <TableCell>
                {new Date(assignment.due_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {Number(assignment.weight).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0
                })}%
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2">
                  <Image
                    src={assignment.published ? generalImages.published : generalImages.draft}
                    className="h-4 w-4"
                    alt="status"
                    width={16}
                    height={16}
                  />
                  {assignment.published ? "Published" : "Draft"}
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