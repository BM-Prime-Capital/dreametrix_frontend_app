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
import { useTeachers } from "@/hooks/SchoolAdmin/use-teachers";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function TeachersTable() {
  const { teachers, isLoading, error } = useTeachers();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <Loader className="text-blue-600" />
          <p className="mt-4 text-sm text-slate-500">
            Chargement des enseignants...
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

  if (teachers.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500">
        Aucun enseignant trouvé. Veuillez en ajouter un nouveau.
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>TEACHER</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>USERNAME</TableHead>
            <TableHead>PHONE</TableHead>
            <TableHead>VIEW MORE</TableHead>
            <TableHead>EDIT</TableHead>
            <TableHead>DELETE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher, index) => (
            <TableRow key={teacher.id}>
              <TableCell className="font-medium">
                {teacher.user.first_name} {teacher.user.last_name}
              </TableCell>
              <TableCell>{teacher.user.email}</TableCell>
              <TableCell>{teacher.user.username}</TableCell>
              <TableCell>{teacher.user.phone_number || "N/A"}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4 text-sky-500" />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4 text-sky-500" />
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
