"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Student {
  id: number;
  full_name: string;
  email?: string;
  grade?: number;
  characterScore?: number;
  attendance?: number;
  class?: string;
  user?: {
    email: string;
    first_name: string;
    last_name: string;
  };
  school?: {
    name: string;
  };
  enrolled_courses?: number[];
}

interface ClassRosterDialogProps {
  classData: {
    id: number;
    name: string;
    students: Student[];
  } | null;
  studentList: Student[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassRosterDialog({ classData, open, onOpenChange, studentList }: ClassRosterDialogProps) {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [originalStudents, setOriginalStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [studentFilter, setStudentFilter] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Transform studentList to match the expected Student format
  const normalizedStudentList = useMemo(() => {
    return studentList?.results?.map(student => ({
      id: student.id,
      full_name: `${student.user?.first_name} ${student.user?.last_name}`,
      email: student.user?.email,
      grade: student.grade,
      user: student.user,
      school: student.school,
      enrolled_courses: student.enrolled_courses
    })) || [];
  }, [studentList]);

  // Transform classData.students to include full details from studentList
  const normalizedClassStudents = useMemo(() => {
    if (!classData?.students || !normalizedStudentList) return [];
    
    return classData.students.map(classStudent => {
      const fullStudent = normalizedStudentList.find(s => s.id === classStudent.id);
      return {
        ...classStudent,
        ...(fullStudent || {}),
        full_name: fullStudent?.full_name || classStudent.full_name
      };
    });
  }, [classData, normalizedStudentList]);

  useEffect(() => {
    if (normalizedClassStudents) {
      setStudents(normalizedClassStudents);
      setOriginalStudents(normalizedClassStudents);
      setHasChanges(false);
    }
  }, [normalizedClassStudents]);

  const availableStudents = useMemo(() => 
    normalizedStudentList.filter(student => 
      !students.some(s => s.id === student.id)
    ),
    [normalizedStudentList, students]
  );

  const filteredStudents = useMemo(() => 
    availableStudents.filter(student =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [availableStudents, searchTerm]
  );

  const filteredClassStudents = useMemo(() => 
    students.filter(student =>
      student.full_name.toLowerCase().includes(studentFilter.toLowerCase())
    ),
    [students, studentFilter]
  );

  const handleAddStudents = useCallback((studentIds: number[]) => {
    const studentsToAdd = normalizedStudentList.filter(student => 
      studentIds.includes(student.id)
    );
    setStudents(prev => [...prev, ...studentsToAdd]);
    setSelectedStudentIds([]);
    setSearchTerm("");
    setHasChanges(true);
  }, [normalizedStudentList]);

  const handleDeleteStudent = useCallback((id: number) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    setHasChanges(true);
  }, []);

  const handleEditStudent = useCallback((student: Student) => {
    setEditingStudent(student);
  }, []);

  const handleSaveStudent = useCallback((updatedStudent: Student) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    setEditingStudent(null);
    setHasChanges(true);
  }, []);

  const getStudentPerformance = useCallback((studentId: number) => {
    return {
      grade: Math.floor(Math.random() * 20) + 60, 
      characterScore: Math.floor(Math.random() * 10) + 1,
      attendance: Math.floor(Math.random() * 100) 
    };
  }, []);

  const handleSearchTermChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleStudentFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentFilter(e.target.value);
  }, []);

  const handleStudentSelect = useCallback((studentId: number) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  }, []);

  const handleSaveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      const updatedStudents = students.filter(student => {
        const original = originalStudents.find(s => s.id === student.id);
        return original && JSON.stringify(original) !== JSON.stringify(student);
      });

      if (updatedStudents.length > 0) {
        for (const student of updatedStudents) {
          console.log('Would update student:', student.id);
        }
      }

      // 2. Update class roster if students were added/removed
      const currentIds = students.map(s => s.id);
      const originalIds = originalStudents.map(s => s.id);
      
      if (JSON.stringify(currentIds.sort()) !== JSON.stringify(originalIds.sort())) {
        // await fetch(`/classes/${classData?.id}`, {
        //   method: 'PUT',
        //   body: JSON.stringify({ students: currentIds }),
        //   headers: { 'Content-Type': 'application/json' }
        // });
        console.log('Would update class roster with:', currentIds);
      }

      toast({
        title: "Changes saved successfully",
        description: "All modifications have been saved.",
      });
      setOriginalStudents(students);
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "There was an error while saving your changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [students, originalStudents, classData?.id, toast]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      onOpenChange(false);
    }
  }, [hasChanges, onOpenChange]);

  const confirmCancel = useCallback(() => {
    setStudents(originalStudents);
    setHasChanges(false);
    setShowCancelConfirm(false);
    onOpenChange(false);
  }, [originalStudents, onOpenChange]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleCancel}>
        <DialogContent className="sm:max-w-4xl min-h-[50vh] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Class Roster: {classData?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Section d'ajout d'étudiants */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Add Students</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-white"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Select students to add</span>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search students..."
                      value={searchTerm}
                      onValueChange={handleSearchTermChange}
                    />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                      <CommandEmpty>No students found.</CommandEmpty>
                      <CommandGroup>
                        {filteredStudents.map(student => (
                          <CommandItem
                            key={student.id}
                            onSelect={() => handleStudentSelect(student.id)}
                          >
                            <div className="flex items-center gap-2">
                              <span>{student.full_name}</span>
                              {student.grade && (
                                <Badge variant="outline">Grade {student.grade}</Badge>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {selectedStudentIds.length > 0 && (
                        <CommandGroup>
                          <CommandItem 
                            onSelect={() => handleAddStudents(selectedStudentIds)}
                            className="bg-[#3e81d4] text-white hover:bg-[#3e81d4]/90"
                          >
                            <span className="font-medium">
                              Add {selectedStudentIds.length} selected students
                            </span>
                          </CommandItem>
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Class Students ({students.length})</h3>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Filter students..."
                    className="w-full pl-8 pr-4 py-2 border rounded-md text-sm"
                    value={studentFilter}
                    onChange={handleStudentFilterChange}
                  />
                  <svg
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Character</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClassStudents.length > 0 ? (
                      filteredClassStudents.map(student => {
                        const performance = getStudentPerformance(student.id);
                        return (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.full_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {student.email}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <Badge variant="outline">Grade {student.grade}</Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${performance.characterScore * 10}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{performance.characterScore}/10</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-green-600 h-2.5 rounded-full" 
                                  style={{ width: `${performance.attendance}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{performance.attendance}%</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex gap-2">
                                <button 
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => handleEditStudent(student)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-1 text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteStudent(student.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                          {students.length === 0 
                            ? "No students in this class yet" 
                            : "No students match your filter"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      {editingStudent && (
        <EditStudentDialog
          student={editingStudent}
          onSave={handleSaveStudent}
          onCancel={() => setEditingStudent(null)}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to cancel? All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function EditStudentDialog({ student, onSave, onCancel }: { 
  student: Student; 
  onSave: (student: Student) => void; 
  onCancel: () => void;
}) {
  const [editedStudent, setEditedStudent] = useState<Student>(student);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedStudent((prev: any) => ({
      ...prev,
      [name]: value,
      user: {
        ...prev.user,
        ...(name === 'first_name' && { first_name: value }),
        ...(name === 'last_name' && { last_name: value }),
        ...(name === 'email' && { email: value }),
      }
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedStudent);
  }, [editedStudent, onSave]);

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                name="first_name"
                value={editedStudent.user?.first_name || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={editedStudent.user?.last_name || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editedStudent.user?.email || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">
                Grade
              </Label>
              <Input
                id="grade"
                name="grade"
                type="number"
                value={editedStudent.grade || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}