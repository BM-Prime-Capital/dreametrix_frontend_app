/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, AlertCircle, Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  ISchoolClass, Class } from "@/types";
import { useList } from "@/hooks/useList";
import { getTeachers } from "@/services/TeacherService";
import {ALL_GRADES, dayOfTheWeek, localStorageKey} from "@/constants/global";
import { createClass, updateClass } from "@/services/ClassService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getGrades, getSubjects } from "@/services/DigitalLibraryService";
import { convertToClassDays, convertToClassSchedule } from "@/utils/global";
import SimpleLoader from "../ui/simple-loader";
// import AlertMessage from "../ui/alert-message";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Swal from "sweetalert2";
import { useToast } from "@/components/ui/use-toast";
import { useOnboarding } from "@/hooks/useOnboarding";

interface ClassDay {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
}

interface Subject {
  name: string;
  short_name: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  grade: number;
}

const schoolClassInit: ISchoolClass = {
  name: "",
  subject_in_all_letter: "",
  subject_in_short: "",
  hours_and_dates_of_course_schedule: {},
  description: "",
  grade: "",
  teacher: 1,
  students: [],
};

const SUBJECT_OPTIONS = [
  "Math", 
  "ELA", 
  "History", 
  "Physical Education", 
  "Geography", 
  "Science"
];

export function AddClassDialog({
  setRefreshTime,
  existingClass,
}: {
  setRefreshTime: Function;
  existingClass?: typeof schoolClassInit;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { list: teachers } = useList(getTeachers);
  const { list: subjects, isLoading: areSubjectsLoading } = useList(getSubjects);
  const [grades, setGrades] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [areStudentsLoading, setAreStudentsLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { markTaskComplete } = useOnboarding();
  // const [message, setMessage] = useState<{
  //   content: string;
  //   color: string;
  // } | null>(null);
  const [areGradesLoading, setAreGradesLoading] = useState(true);

  const [schoolClass, setSchoolClass] = useState<ISchoolClass>(schoolClassInit);
  const [classDays, setClassDays] = useState<ClassDay[]>([]);
  
  // États pour le select avec recherche
  const [subjectOptions, setSubjectOptions] = useState<string[]>(SUBJECT_OPTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const addNewClassDay = (e: any) => {
    e.preventDefault();
    const newId = classDays.length > 0 ? classDays[classDays.length - 1].id + 1 : 1;
    setClassDays([
      ...classDays,
      {
        id: newId,
        day: "Monday",
        start_time: "08:30",
        end_time: "10:30",
      },
    ]);
  };

  const handleClassDayChange = (
    classDayId: number,
    fieldName: keyof ClassDay,
    newValue: string
  ) => {
    setClassDays(
      classDays.map((day) =>
        day.id === classDayId ? { ...day, [fieldName]: newValue } : day
      )
    );
  };

  const handleDeleteClassDay = (id: number) => {
    setClassDays(classDays.filter((day) => day.id !== id));
  };

  const resetForm = () => {
    setSchoolClass(schoolClassInit);
    setClassDays([]);
    setStudents([]);
    setSearchQuery("");
    setCustomSubject("");
    setIsAddingCustom(false);
  };

  const updateClassesCache = (updatedClass: Class, isNew: boolean) => {
    if (typeof window === "undefined" || !updatedClass?.id) return;
    try {
      const stored = window.localStorage.getItem(localStorageKey.ALL_CLASSES);
      const parsed: Class[] = stored ? JSON.parse(stored) : [];
      let updatedList: Class[];

      if (isNew) {
        const exists = parsed.some(cls => cls.id === updatedClass.id);
        updatedList = exists
          ? parsed.map(cls => (cls.id === updatedClass.id ? updatedClass : cls))
          : [...parsed, updatedClass];
      } else {
        let replaced = false;
        updatedList = parsed.map(cls => {
          if (cls.id === updatedClass.id) {
            replaced = true;
            return updatedClass;
          }
          return cls;
        });
        if (!replaced) {
          updatedList = [...updatedList, updatedClass];
        }
      }

      window.localStorage.setItem(localStorageKey.ALL_CLASSES, JSON.stringify(updatedList));
    } catch (error) {
      console.error("Error updating local classes cache:", error);
    }
  };

  const handleAddCustomSubject = (subject: string) => {
    if (subject.trim() && !subjectOptions.includes(subject.trim())) {
      const newSubject = subject.trim();
      setSubjectOptions([...subjectOptions, newSubject]);
      setSchoolClass({
        ...schoolClass,
        subject_in_short: newSubject,
      });
      setSearchQuery("");
      setIsAddingCustom(false);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }
  };

  const filteredSubjects = subjectOptions.filter(subject =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubjectSelect = (value: string) => {
    setSchoolClass({
      ...schoolClass,
      subject_in_short: value,
    });
    setSearchQuery("");
    setIsAddingCustom(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    const exists = subjectOptions.some(option => 
      option.toLowerCase() === value.toLowerCase()
    );
    
    if (value && !exists) {
      setIsAddingCustom(true);
      setCustomSubject(value);
    } else {
      setIsAddingCustom(false);
      setCustomSubject("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Convert students back to array of IDs for backend payload
      const studentIds = schoolClass.students.map(student =>
        typeof student === 'number' ? student : student.id
      );

      // Validation: require at least one student for both creation and update
      if (studentIds.length === 0) {
        await Swal.close();
        setIsSubmitting(false);
        toast({
          title: 'Students required',
          description: 'Please select at least one student before saving the class.',
          variant: 'destructive',
        });
        const el = document.getElementById('students-section');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const data: ISchoolClass = {
        ...schoolClass,
        students: studentIds, // Send as array of IDs to backend
        hours_and_dates_of_course_schedule: convertToClassSchedule(classDays),
        subject_in_all_letter: schoolClass.name,
      };

      // Show loading only after validations pass (do not await)
      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const rep = existingClass
        ? await updateClass(data as any, tenantDomain, accessToken, refreshToken)
        : await createClass(data, tenantDomain, accessToken, refreshToken);

      if (!rep) {
        await Swal.close();
        setOpen(false); 
        await Swal.fire({
          title: 'Error!',
          text: existingClass
            ? "The class update failed, try again please, if this persists contact the admin."
            : "The class creation failed, be sure that you are not creating an existing class, if this persists, please contact the admin.",
          icon: 'error',
          customClass: {
            title: 'text-lg font-semibold',
            htmlContainer: 'text-sm',
            confirmButton: 'text-sm px-4 py-2'
          },
          confirmButtonColor: '#3085d6',
        });
      } else {
        await Swal.close();
        setOpen(false);
        setOpen(false); 
        
        // Mark class creation task as complete for new classes
        if (!existingClass) {
          markTaskComplete('teacher_create_class');
        }
        
        if (rep) {
          updateClassesCache(rep as Class, !existingClass);
        }

        await Swal.fire({
          title: 'Success!',
          text: existingClass
            ? "Class updated with success!"
            : "Class created with success!",
          icon: 'success',
          customClass: {
            title: 'text-lg font-semibold',
            htmlContainer: 'text-sm',
            confirmButton: 'text-sm px-4 py-2'
          },
          confirmButtonColor: '#3085d6',
        });

        setRefreshTime(new Date().toISOString());
        if (!existingClass) {
          resetForm();
        }
        setTimeout(() => setOpen(false), 1000);
      }
    } catch (error) {
      await Swal.close();
      setOpen(false); 
      const rawMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const friendlyMessage = /no students available for this grade/i.test(rawMessage)
        ? "No students available for this grade. Add students or choose another grade."
        : rawMessage;
      await Swal.fire({
        title: 'Error!',
        text: friendlyMessage,
        icon: 'error',
        customClass: {
          title: 'text-lg font-semibold',
          htmlContainer: 'text-sm',
          confirmButton: 'text-sm px-4 py-2'
        },
        confirmButtonColor: '#3085d6',
      });
    } finally {
      Swal.close(); 
      setIsSubmitting(false);
    }
  };

  const fetchStudentsByGrade = async (grade: string) => {
    if (!tenantDomain || !accessToken) return;

    setAreStudentsLoading(true);
    try {
      const response = await fetch(
        `${tenantDomain}/students/?grade=${grade}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      // Formater correctement les données des étudiants
      const formattedStudents = data.results.map((student: any) => ({
        id: student.id,
        firstName: student.user.first_name,
        lastName: student.user.last_name,
        grade: student.grade
      }));
      setStudents(formattedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setAreStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (open && existingClass) {
      // Set the school class with all existing data including students
      setSchoolClass({
        ...existingClass,
        students: existingClass.students || []
      });
      setClassDays(convertToClassDays(existingClass.hours_and_dates_of_course_schedule));

      // Ajouter le sujet existant aux options s'il n'existe pas
      if (existingClass.subject_in_short && !subjectOptions.includes(existingClass.subject_in_short)) {
        setSubjectOptions([...subjectOptions, existingClass.subject_in_short]);
      }

      // Chargez les étudiants si nécessaire
      if (existingClass.grade) {
        fetchStudentsByGrade(existingClass.grade);
      }
    } else if (!open) {
      // Réinitialisez le formulaire lorsque le modal se ferme
      setSchoolClass(schoolClassInit);
      setClassDays([]);
      setStudents([]);
      setSearchQuery("");
      setCustomSubject("");
      setIsAddingCustom(false);
    }
  }, [open, existingClass]);

  // Modify grades loading useEffect
  useEffect(() => {
    const loadGrades = async () => {
      if (schoolClass.subject_in_short && tenantDomain && accessToken && refreshToken) {
        setAreGradesLoading(true);
        try {
          const grades = await getGrades(
            schoolClass.subject_in_short,
            tenantDomain,
            accessToken,
            refreshToken
          ) || [];
          setGrades(grades);
        } catch (error) {
          console.error("Error loading grades:", error);
          setGrades([]);
        } finally {
          setAreGradesLoading(false);
        }
      }
    };

    loadGrades();
  }, [schoolClass.subject_in_short, tenantDomain, accessToken, refreshToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (schoolClass.grade) {
        fetchStudentsByGrade(schoolClass.grade);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [schoolClass.grade]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existingClass ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
            <Pencil className="h-4 w-4 text-[#25AAE1]" />
          </Button>
        ) : (
          <Button className="gap-2 text-base bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-white rounded-xl px-5 py-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group">
            <div className="relative flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="w-7 h-7 transform group-hover:rotate-180 transition-transform duration-300"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 5V19M5 12H19"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-30"
                />
              </svg>
            </div>
            <span className="font-semibold tracking-wide">Add New Class</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] rounded-2xl border-0 shadow-2xl">
        <DialogHeader className="pb-6 border-b border-gray-100 sticky top-0 z-10 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {existingClass ? "Update Class" : "Create New Class"}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {existingClass ? "Modify class details and settings" : "Set up a new class with students and schedule"}
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Select avec recherche pour Subject In Short */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Subject In Short
                </label>
                <Select
                  value={schoolClass.subject_in_short}
                  onValueChange={handleSubjectSelect}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select or type a subject" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {/* Barre de recherche */}
                    <div className="relative p-2 border-b">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search or add subject..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 pr-4 py-2 h-9 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Options filtrées */}
                    <div className="max-h-40 overflow-y-auto">
                      {filteredSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                      
                      {/* Option pour ajouter un nouveau sujet */}
                      {isAddingCustom && searchQuery.trim() && (
                        <div
                          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 mx-2 my-1"
                          onClick={() => handleAddCustomSubject(searchQuery)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add "{searchQuery}"
                        </div>
                      )}

                      {/* Message si aucun résultat */}
                      {filteredSubjects.length === 0 && !isAddingCustom && (
                        <div className="px-2 py-3 text-sm text-gray-500 text-center">
                          No subjects found. Type to add a new one.
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Input pour Class Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Class Name
                </label>
                <Input
                  className="rounded-lg"
                  placeholder="Class Name"
                  value={schoolClass.name}
                  onChange={(e) => setSchoolClass({
                    ...schoolClass,
                    name: e.target.value,
                  })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              <select
                className="px-2 py-1 bg-white rounded-lg border"
                value={schoolClass.grade}
                onChange={(e) => {
                  setSchoolClass({
                    ...schoolClass,
                    grade: e.target.value,
                    students: [],
                  });
                }}
                aria-label="Select Grade"
                title="Select Grade"
                required
              >
                <option disabled value="">Select Grade</option>
                {(grades || []).length > 0 ? (
                  grades.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))
                ) : (
                  ALL_GRADES.map((grade) => (
                    <option key={grade} value={grade.toString()}>
                      Grade {grade}
                    </option>
                  ))
                )}
              </select>
            </div>

            {schoolClass.grade && (
              <div id="students-section" className="border rounded-lg p-4 space-y-4">
                <label className="text-sm font-medium text-gray-700">
                  Students (Grade {schoolClass.grade})
                </label>

                {areStudentsLoading ? (
                  <SimpleLoader />
                ) : students.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {students.map((student) => {
                      const studentId = Number(student.id);
                      const isChecked = schoolClass.students.some(existingStudent => {
                        const existingId = typeof existingStudent === 'number'
                          ? existingStudent
                          : existingStudent.id;
                        return Number(existingId) === studentId;
                      });
                      return (
                        <div key={student.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const currentStudents = schoolClass.students.map(student =>
                                typeof student === 'number'
                                  ? { id: student, full_name: `Student ${student}` }
                                  : student
                              ) as { id: number; full_name: string }[];

                              if (checked) {
                                const newStudents = [...currentStudents, {id: studentId, full_name: `${student.firstName} ${student.lastName}`}];
                                setSchoolClass({
                                  ...schoolClass,
                                  students: newStudents,
                                });
                              } else {
                                const newStudents = currentStudents.filter(existingStudent =>
                                  Number(existingStudent.id) !== studentId
                                );
                                setSchoolClass({
                                  ...schoolClass,
                                  students: newStudents,
                                });
                              }
                            }}
                          />
                          <label htmlFor={`student-${student.id}`} className="text-sm">
                            {student.firstName} {student.lastName}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No students found for grade {schoolClass.grade}
                  </p>
                )}
              </div>
            )}

            <div className="border rounded-lg p-4 space-y-4 mt-4">
              <label className="text-sm font-medium text-gray-700">
                Class Schedule
              </label>

              {classDays.map((schedule) => (
                <div key={schedule.id} className="grid grid-cols-4 gap-2 items-center">
                  <Select
                    value={schedule.day}
                    onValueChange={(value) => handleClassDayChange(schedule.id, "day", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOfTheWeek.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="time"
                    value={schedule.start_time}
                    onChange={(e) => handleClassDayChange(schedule.id, "start_time", e.target.value)}
                    placeholder="09:00 AM"
                  />

                  <Input
                    type="time"
                    value={schedule.end_time}
                    onChange={(e) => handleClassDayChange(schedule.id, "end_time", e.target.value)}
                    placeholder="01:00 PM"
                  />

                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteClassDay(schedule.id);
                    }}
                    type="button"
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addNewClassDay}
                className="w-full mt-2"
              >
                {classDays.length === 0 ? 'Add a schedule' : 'Add another schedule'}
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 sticky bottom-0 bg-white z-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="px-6 py-2 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={existingClass ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    {existingClass ? "Update Class" : "Create Class"}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}