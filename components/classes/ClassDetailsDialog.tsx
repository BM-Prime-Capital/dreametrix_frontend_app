"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ISchoolClass, IStudent, ITeacher } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { Bookmark, BookOpen, Calendar, Clock, FileText, GraduationCap, List, User, User2, Users, X } from "lucide-react";

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

  // const getStudentName = (student: IStudent | number): string => {
  //   if (typeof student === 'number') return `Student ID: ${student}`;
  //   return `${student.first_name || (student.user?.first_name || '')} ${student.last_name || (student.user?.last_name || '')}`.trim() || 
  //          `Student ID: ${student.id}`;
  // };

  // const getStudentId = (student: IStudent | number): number => {
  //   return typeof student === 'number' ? student : student.id;
  // };

  const getStudentsCount = (students: (IStudent | number)[]): number => {
    return Array.isArray(students) ? students.length : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="relative bg-gradient-to-r from-blue-700 to-blue-600 text-white p-6">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-5 w-5 text-white/90 hover:text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <DialogHeader>
            <div className="pr-6">
              <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-white/90" />
                {classData.name || "Class Details"}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 pt-3">
                <Badge className="bg-white/90 text-blue-700 hover:bg-white px-3 py-1 font-medium flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  Grade: {classData.grade || "N/A"}
                </Badge>
                <Badge className="bg-white/90 text-blue-700 hover:bg-white px-3 py-1 font-medium flex items-center gap-1">
                  <Bookmark className="h-4 w-4" />
                  {classData.subject_in_short || "Subject N/A"}
                </Badge>
              </div>
            </div>
          </DialogHeader>
        </div>
  
        <ScrollArea className="h-[70vh] px-6 py-4">
          <div className="space-y-6">
            {/* Teacher Card */}
            <Card className="border border-gray-100 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-700 p-2.5 rounded-lg">
                    <User2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Teacher</h3>
                    <p className="text-sm text-gray-500">Responsible instructor</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 pl-1">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-800">{getTeacherName(classData.teacher)}</p>
                    <p className="text-sm text-gray-500">Lead instructor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Description Card */}
            {classData.description && (
              <Card className="border border-gray-100 shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 p-2.5 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                      <p className="text-sm text-gray-500">Course overview and objectives</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-1">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {classData.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
  
            <Card className="border border-gray-100 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-700 p-2.5 rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
                    <p className="text-sm text-gray-500">Class meeting times</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-1">
                {classData.hours_and_dates_of_course_schedule && Object.entries(classData.hours_and_dates_of_course_schedule).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(classData.hours_and_dates_of_course_schedule).map(([day, schedules]) => (
                      <div key={day} className="border-l-2 border-blue-400 pl-4 py-2">
                        <h4 className="font-medium text-gray-800 flex items-center gap-2">
                          <span className="bg-blue-50 text-blue-600 p-1.5 rounded-md">
                            <Clock className="h-4 w-4" />
                          </span>
                          {day}
                        </h4>
                        <div className="mt-2 space-y-2 ml-2">
                          {Array.isArray(schedules) ? (
                            schedules.map((schedule, index) => (
                              <div key={index} className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-md border border-gray-100">
                                <span className="text-blue-500">
                                  <Clock className="h-4 w-4" />
                                </span>
                                <span className="font-medium text-gray-700">
                                  {schedule.start_time || "N/A"} - {schedule.end_time || "N/A"}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-md border border-gray-100">
                              <span className="text-blue-500">
                                <Clock className="h-4 w-4" />
                              </span>
                              <span className="font-medium text-gray-700">
                                {schedules?.start_time || "N/A"} - {schedules?.end_time || "N/A"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center text-gray-500">
                    No schedule available
                  </div>
                )}
              </CardContent>
            </Card>
  
            <Card className="border border-gray-100 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-700 p-2.5 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Students</h3>
                    <p className="text-sm text-gray-500">{getStudentsCount(classData.students)} enrolled</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-1">
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                  <List className="h-4 w-4 mr-2" />
                  View student list
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
  
}