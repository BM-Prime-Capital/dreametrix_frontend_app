/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { enrollStudentsToClass, unenrollStudentsFromClass, updateStudent } from "@/services/student-service";

interface Student {
  id: number;
  full_name: string;
  email?: string;
  grade?: number;
  characterScore?: number;
  attendance?: number;
  class?: string;
  user?:any;
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
  studentList: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantPrimaryDomain: string;
  accessToken: string;
  refreshToken: string;
}

export function ClassRosterDialog({ 
  classData, 
  open, 
  onOpenChange, 
  studentList,
  tenantPrimaryDomain,
  accessToken,
  refreshToken
}: ClassRosterDialogProps) {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [originalStudents, setOriginalStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [studentFilter, setStudentFilter] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [changesSummary, setChangesSummary] = useState<{
    toAdd: Student[];
    toRemove: Student[];
  }>({ toAdd: [], toRemove: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const normalizedStudentList: Student[] = useMemo(() => {
    return studentList?.results?.map((student: any) => ({
      id: student.id,
      full_name: `${student.user?.first_name} ${student.user?.last_name}`,
      email: student.user?.email,
      grade: student.grade,
      user: student.user,
      school: student.school,
      enrolled_courses: student.enrolled_courses,
      characterScore: Math.floor(Math.random() * 10) + 1,
      attendance: Math.floor(Math.random() * 100)
    })) || [];
  }, [studentList]);  

  const normalizedClassStudents = useMemo(() => {
    if (!classData?.students || !normalizedStudentList) return [];
    
    return classData.students.map(classStudent => {
      const fullStudent = normalizedStudentList.find(s => s.id === classStudent.id);
      return {
        ...classStudent,
        ...(fullStudent || {}),
        full_name: fullStudent?.full_name || classStudent.full_name,
        characterScore: fullStudent?.characterScore || Math.floor(Math.random() * 10) + 1,
        attendance: fullStudent?.attendance || Math.floor(Math.random() * 100)
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
    normalizedStudentList.filter((student:any) => 
      !students.some(s => s.id === student.id)
    ),
    [normalizedStudentList, students]
  );

  const filteredStudents = useMemo(() => 
    availableStudents.filter((student:any) =>
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
    const studentsToAdd = normalizedStudentList.filter((student:any) => 
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

  const handleSaveStudent = useCallback(async (updatedStudent: Student) => {
    setIsEditing(true); 
    try {
      const studentData = {
        user: {
          first_name: updatedStudent.user?.first_name,
          last_name: updatedStudent.user?.last_name,
        }
      };

      const userId = updatedStudent.user?.id || updatedStudent.id;
      await updateStudent(
        userId,
        studentData.user,
        tenantPrimaryDomain,
        accessToken,
        refreshToken
      );
  
      setStudents(prev => 
        prev.map(student => 
          student.id === updatedStudent.id ? {
            ...student,
            ...updatedStudent,
            full_name: `${updatedStudent.user?.first_name} ${updatedStudent.user?.last_name}`
          } : student
        )
      );
      setEditingStudent(null);  
      toast({
        title: "Student updated successfully",
        description: "The student information has been saved.",
      });
    } catch (error) {
      console.error("Error saving student:", error);
      toast({
        title: "Error saving student",
        description: "There was an error while saving the student information.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  }, [tenantPrimaryDomain, accessToken, refreshToken, toast]);

  const prepareSaveChanges = useCallback(() => {
    const currentIds = students.map(s => s.id);
    const originalIds = originalStudents.map(s => s.id);
    
    const toAdd = students.filter(student => !originalIds.includes(student.id));
    const toRemove = originalStudents.filter(student => !currentIds.includes(student.id));
    
    setChangesSummary({ toAdd, toRemove });
    setShowSaveConfirm(true);
  }, [students, originalStudents]);

  const executeSaveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      const currentIds = students.map(s => s.id);
      const originalIds = originalStudents.map(s => s.id);
      
      const studentsToAdd = currentIds.filter(id => !originalIds.includes(id));
      const studentsToRemove = originalIds.filter(id => !currentIds.includes(id));
  
      if (studentsToAdd.length > 0) {
        await enrollStudentsToClass(
          classData?.id || 0,
          studentsToAdd,
          tenantPrimaryDomain,
          accessToken,
          refreshToken
        );
      }
  
      if (studentsToRemove.length > 0) {
        await unenrollStudentsFromClass(
          classData?.id || 0,
          studentsToRemove,
          tenantPrimaryDomain,
          accessToken,
          refreshToken
        );
      }
  
      toast({
        title: "Changes saved successfully",
        description: "All modifications have been saved.",
      });
      setOriginalStudents(students);
      setHasChanges(false);
      setShowSaveConfirm(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error saving changes",
        description: "There was an error while saving your changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    students, 
    originalStudents, 
    classData?.id, 
    tenantPrimaryDomain, 
    accessToken, 
    refreshToken, 
    toast,
    onOpenChange
  ]);

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
        <DialogContent className="sm:max-w-4xl min-h-[50vh] max-h-[80vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>Class Roster: {classData?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
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
                      <CommandGroup className="max-h-[250px] overflow-y-auto">
                        {filteredStudents.map((student:any) => (
                          <CommandItem
                            key={student.id}
                            onSelect={() => handleStudentSelect(student.id)}
                            className="cursor-pointer"
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
                            className="bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
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
                      {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Character</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th> */}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClassStudents.length > 0 ? (
                      filteredClassStudents.map(student => (
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
                          {/* <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${student.characterScore && (student.characterScore * 10)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{student.characterScore}/10</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${student.attendance}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{student.attendance}%</span>
                          </td> */}
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
                      ))
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
              variant="primary"
              onClick={prepareSaveChanges}
              disabled={!hasChanges || isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white" 
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingStudent && (
        <Dialog open={true} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Edit Student Information</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveStudent(editingStudent);
            }}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={editingStudent.user?.first_name || ''}
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          user: {
                            ...editingStudent.user,
                            first_name: e.target.value
                          }
                        })}
                        disabled={isSaving}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={editingStudent.user?.last_name || ''}
                        onChange={(e) => setEditingStudent({
                          ...editingStudent,
                          user: {
                            ...editingStudent.user,
                            last_name: e.target.value
                          }
                        })}
                        disabled={isSaving}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editingStudent.user?.email || ''}
                      onChange={(e) => setEditingStudent({
                        ...editingStudent,
                        user: {
                          ...editingStudent.user,
                          email: e.target.value
                        }
                      })}
                      disabled={isSaving}
                      placeholder="student@example.com"
                    />
                  </div>
                </div>

                {/* <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade Level</Label>
                      <Input
                        id="grade"
                        name="grade"
                        type="number"
                        value={editingStudent.grade || ''}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="characterScore">Character Score</Label>
                      <Input
                        id="characterScore"
                        name="characterScore"
                        type="number"
                        min="1"
                        max="10"
                        value={editingStudent.characterScore || ''}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attendance">Attendance (%)</Label>
                      <Input
                        id="attendance"
                        name="attendance"
                        type="number"
                        min="0"
                        max="100"
                        value={editingStudent.attendance || ''}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                </div> */}
              </div>

              <DialogFooter className="mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingStudent(null)}
                  disabled={isSaving}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isEditing}
                  >
                    {isEditing ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </div>
                    )}
                  </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
      
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

      <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Please review the changes before saving:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {changesSummary.toAdd.length > 0 && (
              <div>
                <h4 className="font-medium text-sm">Students to be added ({changesSummary.toAdd.length}):</h4>
                <ul className="mt-2 space-y-1">
                  {changesSummary.toAdd.map(student => (
                    <li key={student.id} className="text-sm text-green-600">
                      {student.full_name} (Grade {student.grade})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {changesSummary.toRemove.length > 0 && (
              <div>
                <h4 className="font-medium text-sm">Students to be removed ({changesSummary.toRemove.length}):</h4>
                <ul className="mt-2 space-y-1">
                  {changesSummary.toRemove.map(student => (
                    <li key={student.id} className="text-sm text-red-600">
                      {student.full_name} (Grade {student.grade})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeSaveChanges}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Confirm & Save'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}