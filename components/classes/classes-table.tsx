'use client '

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

// Sample student data
const students = [
  {
    id: 1,
    name: "Fee, Martha",
    studentId: "ID 19727456",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "John, Smith",
    studentId: "ID 45187278",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Fee, Martha",
    studentId: "ID 19727456",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "John, Smith",
    studentId: "ID 45187278",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Fee, Martha",
    studentId: "ID 19727456",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "John, Smith",
    studentId: "ID 45187278",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    name: "Fee, Martha",
    studentId: "ID 19727456",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 8,
    name: "John, Smith",
    studentId: "ID 45187278",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

// Sample class data
const classes = [
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
  const [selectedClass, setSelectedClass] = useState<typeof classes[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (class_: typeof classes[0]) => {
    setSelectedClass(class_);
    setIsModalOpen(true);
  };

  return (
    <>
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
                className={`${index % 2 === 0 ? "bg-sky-50/50" : ""} cursor-pointer hover:bg-sky-100/50`}
                onClick={() => handleRowClick(class_)}
              >
                <TableCell>{class_.name}</TableCell>
                <TableCell>{class_.subject}</TableCell>
                <TableCell>{class_.grade}</TableCell>
                <TableCell>{class_.teacher}</TableCell>
                <TableCell>{class_.students}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">STUDENTS</h2>
              <span className="text-gray-500">{selectedClass?.name}</span>
            </div>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex gap-8">
                    <span className="text-gray-900">{student.name}</span>
                    <span className="text-gray-500">{student.studentId}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4 text-gray-400" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}