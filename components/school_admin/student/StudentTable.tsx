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
import { useStudents } from "@/hooks/SchoolAdmin/use-students";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function StudentsTable() {
  const { students, isLoading, error } = useStudents();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <Loader className="text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">
            Chargement des étudiants...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500">
        Aucun étudiant trouvé. Veuillez en ajouter un nouveau.
      </div>
    );
  }

  // Helper function to convert grade number to display format
  const formatGrade = (grade: number) => {
    return `Grade ${grade}`;
  };

  // For demo purposes, we'll alternate between "Paid" and "Debt" status
  // In a real app, this would come from the API
  const getPaymentStatus = (id: number) => {
    return id % 2 === 0 ? "Paid" : "Debt";
  };

  // For demo purposes, we'll alternate between "Morning" and "Afternoon" shifts
  // In a real app, this would come from the API
  const getShift = (id: number) => {
    return id % 2 === 0 ? "Morning" : "Afternoon";
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STUDENT</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>GRADE</TableHead>
            <TableHead>SHIFT</TableHead>
            <TableHead>VIEW MORE</TableHead>
            <TableHead>EDIT</TableHead>
            <TableHead>DELETE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">
                {student.user.first_name} {student.user.last_name}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    getPaymentStatus(student.id) === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {getPaymentStatus(student.id)}
                </span>
              </TableCell>
              <TableCell>{formatGrade(student.grade)}</TableCell>
              <TableCell>{getShift(student.id)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4 text-blue-500" />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4 text-blue-500" />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
