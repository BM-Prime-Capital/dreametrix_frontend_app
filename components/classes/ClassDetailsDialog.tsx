"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ISchoolClass, IStudent, ITeacher } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClassDetailsDialogProps {
  classData: ISchoolClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassDetailsDialog({
  classData,
  open,
  onOpenChange,
}: ClassDetailsDialogProps) {
  if (!classData) return null;

  const getTeacherName = (teacher: ITeacher | number): string => {
    if (typeof teacher === 'number') return `Teacher ID: ${teacher}`;
    return teacher.full_name || 
           (teacher.user ? `${teacher.user.first_name} ${teacher.user.last_name}` : `Teacher ID: ${teacher.id}`);
  };

  const getStudentName = (student: IStudent | number): string => {
    if (typeof student === 'number') return `Student ID: ${student}`;
    return `${student.first_name || (student.user?.first_name || '')} ${student.last_name || (student.user?.last_name || '')}`.trim() || 
           `Student ID: ${student.id}`;
  };

  const getStudentId = (student: IStudent | number): number => {
    return typeof student === 'number' ? student : student.id;
  };

  const getStudentsCount = (students: (IStudent | number)[]): number => {
    return Array.isArray(students) ? students.length : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {classData.name || "Class Details"}
            </DialogTitle>
            <div className="flex items-center space-x-2 pt-2">
              <Badge variant="secondary" className="bg-white text-blue-600">
                {classData.grade || "N/A"}
              </Badge>
              <Badge variant="secondary" className="bg-white text-blue-600">
                {classData.subject_in_short || "N/A"}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="h-[70vh] px-6 py-4">
          <div className="space-y-6">
            {/* Teacher Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </span>
                  Teacher
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{getTeacherName(classData.teacher)}</p>
              </CardContent>
            </Card>

            {/* Description Card */}
            {classData.description && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </span>
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{classData.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Schedule Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classData.hours_and_dates_of_course_schedule && Object.entries(classData.hours_and_dates_of_course_schedule).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(classData.hours_and_dates_of_course_schedule).map(([day, schedules]) => (
                      <div key={day} className="border-l-4 border-blue-500 pl-3">
                        <h4 className="font-medium text-gray-800">{day}</h4>
                        <div className="mt-1 space-y-1">
                          {Array.isArray(schedules) ? (
                            schedules.map((schedule, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">•</span>
                                <span>{schedule.start_time || "N/A"} - {schedule.end_time || "N/A"}</span>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500">•</span>
                              <span>{schedules?.start_time || "N/A"} - {schedules?.end_time || "N/A"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No schedule available</p>
                )}
              </CardContent>
            </Card>

            {/* Students Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </span>
                  Students ({getStudentsCount(classData.students)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(classData.students) && classData.students.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {classData.students.map((student) => (
                      <div key={getStudentId(student)} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                          {getStudentName(student).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{getStudentName(student)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No students enrolled</p>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}