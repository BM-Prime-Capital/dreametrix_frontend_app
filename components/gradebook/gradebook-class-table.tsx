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
import Image from "next/image";
import { RecordDialog } from "./RecordDialog";

// This would typically come from your API
const students = [
  {
    id: 1,
    name: "Prince Ilunga",
    average: "65%",
    examGeneral: 13,
    examPractical: 14,
    quizGeneral: 15,
    quizPop: 15,
    quizUnit1: 15,
    quizUnit2: 15,
    homeWorkGeneral: 45,
    homeWorkChapter: 45,
    homeWorkProject: 45,
  },
  {
    id: 2,
    name: "Marry Jones",
    average: "63%",
    examGeneral: 13,
    examPractical: 14,
    quizGeneral: 15,
    quizPop: 15,
    quizUnit1: 15,
    quizUnit2: 15,
    homeWorkGeneral: 45,
    homeWorkChapter: 45,
    homeWorkProject: 45,
  },
  {
    id: 3,
    name: "Stephan lightman",
    average: "72%",
    examGeneral: 13,
    examPractical: 14,
    quizGeneral: 15,
    quizPop: 15,
    quizUnit1: 15,
    quizUnit2: 15,
    homeWorkGeneral: 45,
    homeWorkChapter: 45,
    homeWorkProject: 45,
  },
];

export function GradebookClassTable() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="text-center">
              STUDENT
            </TableHead>
            <TableHead rowSpan={2} className="text-center">
              AVERAGE
            </TableHead>
            <TableHead colSpan={2} className="text-center">
              EXAM(3)
            </TableHead>
            <TableHead colSpan={4} className="text-center">
              QUIZ(2)
            </TableHead>
            <TableHead colSpan={3} className="text-center">
              HOMEWORK(14)
            </TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead>General</TableHead>
            <TableHead>Practical</TableHead>
            <TableHead>General</TableHead>
            <TableHead>Pop Quiz</TableHead>
            <TableHead>Unit 1</TableHead>
            <TableHead>Unit 2</TableHead>
            <TableHead>Chapter 3</TableHead>
            <TableHead>General</TableHead>
            <TableHead>Project</TableHead>
            <TableHead></TableHead>
          </TableRow>
          {students.map((class_, index) => (
            <TableRow
              key={class_.id}
              className={index % 2 === 0 ? "bg-sky-50/50" : ""}
            >
              <TableCell>{class_.name}</TableCell>
              <TableCell>
                {class_.average} <RecordDialog />
              </TableCell>
              <TableCell>
                <span className="flex gap-1 justify-center">
                  {class_.examGeneral} <RecordDialog />
                </span>
              </TableCell>
              <TableCell>
                <span className="flex gap-1 justify-center">
                  {class_.examPractical} <RecordDialog />
                </span>
              </TableCell>
              <TableCell>
                <span className="flex gap-1 justify-center">
                  {class_.quizGeneral} <RecordDialog />
                </span>
              </TableCell>
              <TableCell>
                <span className="flex gap-1 justify-center">
                  {class_.quizPop} <RecordDialog />
                </span>
              </TableCell>
              <TableCell>
                <span className="flex gap-1 justify-center">
                  {class_.quizUnit1} <RecordDialog />
                </span>
              </TableCell>
              <TableCell>
                <span className="flex gap-1 justify-center">
                  {class_.quizUnit2} <RecordDialog />
                </span>
              </TableCell>
              <TableCell>
                <span className="flex gap-1 justify-center">
                  {class_.homeWorkChapter} <RecordDialog />
                </span>
              </TableCell>
              <TableCell>
                <span className="flex gap-1 justify-center">
                  {class_.homeWorkGeneral} <RecordDialog />
                </span>
              </TableCell>
              <TableCell>
                <span className="flex gap-1 justify-center">
                  {class_.homeWorkProject} <RecordDialog />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
