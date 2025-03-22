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
import { getClasses } from "@/services/ClassService";
import { useEffect, useState } from "react";
import { useList } from "@/hooks/useList";
import NoData from "../ui/no-data";
import { Loader } from "../ui/loader";

// Sample class data
const classesMock = [
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
];

export function ClassesTable() {
  const { list: classes, isLoading, error } = useList(getClasses);

  return (
    <div className="w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {classes.legnth > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold">CLASS</TableHead>
                  <TableHead className="font-bold">SUBJECT</TableHead>
                  <TableHead className="font-bold">GRADE</TableHead>
                  <TableHead className="font-bold">TEACHER</TableHead>
                  <TableHead className="font-bold">STUDENTS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((class_: any, index: number) => (
                  <TableRow key={class_.id}>
                    <TableCell className="font-medium">{class_.name}</TableCell>
                    <TableCell>{class_.subject}</TableCell>
                    <TableCell>{class_.grade}</TableCell>
                    <TableCell>{class_.teacher}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {class_.students}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 text-[#25AAE1]" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4 text-[#25AAE1]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <NoData />
          )}
        </>
      )}
    </div>
  );
}
