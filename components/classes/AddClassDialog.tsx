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
import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ISchoolClass } from "@/types";
import { useList } from "@/hooks/useList";
import { getTeachers } from "@/services/TeacherService";
import { dayOfTheWeek, localStorageKey } from "@/constants/global";
import { createClass, updateClass } from "@/services/ClassService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getGrades, getSubjects } from "@/services/DigitalLibraryService";
import { convertToClassDays, convertToClassSchedule } from "@/utils/global";
import SimpleLoader from "../ui/simple-loader";
import AlertMessage from "../ui/alert-message";
import { Checkbox } from "@/components/ui/checkbox";
import Swal from "sweetalert2";

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

const schoolClassInit = {
  name: "",
  subject_in_all_letter: "",
  subject_in_short: "",
  hours_and_dates_of_course_schedule: {},
  description: "",
  grade: "",
  teacher: 1,
  students: [],
};

export function AddClassDialog({
  setRefreshTime,
  existingClass,
}: {
  setRefreshTime: Function;
  existingClass?: ISchoolClass;
}) {
  const [open, setOpen] = useState(false);
  const { list: teachers } = useList(getTeachers);
  const { list: subjects, isLoading: areSubjectsLoading } = useList(getSubjects);
  const [grades, setGrades] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [areStudentsLoading, setAreStudentsLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [message, setMessage] = useState<{
  //   content: string;
  //   color: string;
  // } | null>(null);
  const [areGradesLoading, setAreGradesLoading] = useState(true);

  // const [schoolClass, setSchoolClass] = useState<ISchoolClass>(
  //   existingClass ? existingClass : schoolClassInit
  // );

  const [schoolClass, setSchoolClass] = useState<ISchoolClass>(schoolClassInit);

  const [classDays, setClassDays] = useState<ClassDay[]>([]);

  const addNewClassDay = (e: any) => {
    e.preventDefault();
    const newId = classDays.length > 0 ? classDays[classDays.length - 1].id + 1 : 1;
    setClassDays([
      ...classDays,
      {
        id: newId,
        day: "Monday",
        start_time: "08:30 AM",
        end_time: "10:30 AM",
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
    // setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      // Afficher l'alerte de chargement
      const loadingAlert = Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    
    try {
      setIsSubmitting(true);

      const data: ISchoolClass = {
        ...schoolClass,
        hours_and_dates_of_course_schedule: convertToClassSchedule(classDays),
        name: `Class ${schoolClass.grade} - ${schoolClass.subject_in_short}`,
      };
  
      const rep = existingClass
        ? await updateClass(data, tenantDomain, accessToken, refreshToken)
        : await createClass(data, tenantDomain, accessToken, refreshToken);
  
      if (!rep) {
        await Swal.close();
        setOpen(false); // Fermer le modal de mise à jour
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
        setOpen(false); // Fermer le modal de mise à jour
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
      setOpen(false); // Fermer le modal de mise à jour
      await Swal.fire({
        title: 'Error!',
        text: error instanceof Error ? error.message : 'An unknown error occurred',
        icon: 'error',
        customClass: {
          title: 'text-lg font-semibold',
          htmlContainer: 'text-sm',
          confirmButton: 'text-sm px-4 py-2'
        },
        confirmButtonColor: '#3085d6',
      });
    } finally {
      Swal.close(); // Fermer l'alerte de chargement
      setIsSubmitting(false);
    }
  };

  

  const handleSubjectChange = async (value: string) => {
    const fullSubject = (subjects as Subject[])?.find(
      (sub: Subject) => sub.short_name === value
    )?.name || value;

    setSchoolClass({
      ...schoolClass,
      subject_in_short: value,
      subject_in_all_letter: fullSubject,
    });

    const grades = await getGrades(
      value,
      tenantDomain,
      accessToken,
      refreshToken
    );
    setGrades(grades);
    setAreGradesLoading(false);
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
      setSchoolClass(existingClass);
      setClassDays(convertToClassDays(existingClass.hours_and_dates_of_course_schedule));
      
      // Chargez les étudiants si nécessaire
      if (existingClass.grade) {
        fetchStudentsByGrade(existingClass.grade);
      }
    } else if (!open) {
      // Réinitialisez le formulaire lorsque le modal se ferme
      setSchoolClass(schoolClassInit);
      setClassDays([]);
      setStudents([]);
    }
  }, [open, existingClass]);
  
  // Modifiez le useEffect de chargement des grades
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
          ) || []; // Ajout d'une fallback value
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
    }, 500); // Délai de 500ms

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
          <Button className="gap-2 text-base bg-blue-500 hover:bg-blue-600">
            <Plus className="h-5 w-5" />
            Add New Class
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            {existingClass ? "Update Class" : "Add New Class"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* {message && <AlertMessage content={message.content} color={message.color} />} */}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Input
                className="rounded-lg"
                placeholder="Subject in short (e.g. Math)"
                value={schoolClass.subject_in_short}
                onChange={(e) => setSchoolClass({
                  ...schoolClass,
                  subject_in_short: e.target.value,
                })}
                required
              />

              <Input
                className="rounded-lg"
                placeholder="Subject in all letter (e.g. Mathematics)"
                value={schoolClass.subject_in_all_letter}
                onChange={(e) => setSchoolClass({
                  ...schoolClass,
                  subject_in_all_letter: e.target.value,
                })}
                required
              />

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
                required
              >
                <option disabled value="">Select Grade</option>
                {(grades || []).length > 0 ? ( // Ajout d'une vérification de null
                  grades.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))
                ) : (
                  [3, 4, 5, 6, 7, 8].map((grade) => (
                    <option key={grade} value={grade.toString()}>
                      Grade {grade}
                    </option>
                  ))
                )}
              </select>

              <Select
                value={`${userData.role === "teacher" ? userData.owner_id : schoolClass.teacher}`}
                onValueChange={(value) => setSchoolClass({
                  ...schoolClass,
                  teacher: Number.parseInt(value),
                })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Teacher" />
                </SelectTrigger>
                <SelectContent>
                  {userData?.role === "teacher" ? (
                    <SelectItem value={`${userData.owner_id}`}>
                      {userData.username}
                    </SelectItem>
                  ) : (
                    teachers.length > 0 ? (
                      teachers.map((teacher: { id: number; name: string }) => (
                        <SelectItem key={teacher.id} value={`${teacher.id}`}>
                          {teacher.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>No teacher</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {schoolClass.grade && (
              <div className="border rounded-lg p-4 space-y-4">
                <label className="text-sm font-medium text-gray-700">
                  Students (Grade {schoolClass.grade})
                </label>
                
                {areStudentsLoading ? (
                  <SimpleLoader />
                ) : students.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={schoolClass.students.includes(student.id)}
                          onCheckedChange={(checked) => {
                            const newStudents = checked
                              ? [...schoolClass.students, student.id]
                              : schoolClass.students.filter(id => id !== student.id);
                            setSchoolClass({
                              ...schoolClass,
                              students: newStudents,
                            });
                          }}
                        />
                        <label htmlFor={`student-${student.id}`} className="text-sm">
                          {student.firstName} {student.lastName}
                        </label>
                      </div>
                    ))}
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
                <div key={schedule.id} className="grid grid-cols-4 gap-2">
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
                    type="text"
                    value={schedule.start_time}
                    onChange={(e) => handleClassDayChange(schedule.id, "start_time", e.target.value)}
                    placeholder="09:00 AM"
                  />

                  <Input
                    type="text"
                    value={schedule.end_time}
                    onChange={(e) => handleClassDayChange(schedule.id, "end_time", e.target.value)}
                    placeholder="01:00 PM"
                  />

                  {classDays.length > 1 && (
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteClassDay(schedule.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addNewClassDay}
                className="w-full mt-2"
              >
                Add Another Schedule
              </Button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isSubmitting
                  ? "Submitting..."
                  : existingClass
                  ? "Update Class"
                  : "Create Class"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
