"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { AttendanceTable } from "./attendance-table";
import { ReportAttendanceDialog } from "./ReportAttendanceDialog";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Pencil, Printer, LayoutDashboard, FileText, Check, X, Clock, AlertCircle, ChevronLeft } from "lucide-react";
import ClassSelect from "../ClassSelect";
import { views } from "@/constants/global";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { initializeAttendances, updateAttendances, getAttendances } from "@/services/AttendanceService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { localStorageKey } from "@/constants/global";
import { toast } from "@/components/ui/use-toast";

export interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

interface Attendance {
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  // Ajoutez d'autres champs si nécessaire
}

export default function AttendanceFocusedView({
  changeView,
}: {
  changeView: Function;
}) {
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isAttendanceDatePast, setIsAttendanceDatePast] = useState(false);
  const [hasAttendances, setHasAttendances] = useState(false);
  const [showInitModal, setShowInitModal] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isToday, setIsToday] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  console.log("tenantDomain")
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const { id: currentClassId } = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
  );

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setIsAttendanceDatePast(new Date(attendanceDate) < new Date(currentDate));
    setIsToday(attendanceDate === currentDate);
    loadData();
  }, [attendanceDate, currentClassId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Charge d'abord les étudiants
      const studentsResponse = await fetch(`${tenantDomain}/api/classes/${currentClassId}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Refresh-Token': refreshToken,
        },
      });
      
      if (!studentsResponse.ok) throw new Error('Failed to load students');
      
      const studentsData = await studentsResponse.json();
      const students = studentsData.students.map((student: any) => ({
        id: student.id,
        name: student.name,
        status: 'absent' // Valeur par défaut
      }));

      // Charge ensuite les présences existantes
      const attendances = await getAttendances(
        {
          date: attendanceDate,
          class_id: currentClassId,
          teacher_id: userData.owner_id,
        },
        tenantDomain,
        accessToken,
        refreshToken
      );

      // Met à jour les statuts des étudiants avec un typage fort
      const updatedStudents = students.map((student: Student) => {
        const attendance = attendances.find((a: Attendance) => a.student_id === student.id);
        return {
          ...student,
          status: attendance?.status || 'absent'
        };
      });

      setStudents(updatedStudents);
      setHasAttendances(attendances.length > 0);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeAttendances = async () => {
    try {
      setIsLoading(true);
      await initializeAttendances(
        {
          date: attendanceDate,
          class_id: currentClassId,
          teacher_id: userData.owner_id,
          status: "present",
        },
        tenantDomain!,
        accessToken!,
        refreshToken!
      );
      await loadData();
      toast({
        title: "Success",
        description: "Attendance list created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error creating attendance list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowInitModal(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const updateAttendanceStatus = async (status: 'present' | 'absent' | 'late' | 'excused') => {
    if (selectedStudents.length === 0) {
      toast({
        title: "Warning",
        description: "Please select at least one student",
        variant: "default",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateAttendances(
        {
          date: attendanceDate,
          student_ids: selectedStudents,
          status,
        },
        tenantDomain!,
        accessToken!,
        refreshToken!
      );

      // Mise à jour locale optimiste
      setStudents(prev => prev.map(student => 
        selectedStudents.includes(student.id) 
          ? { ...student, status } 
          : student
      ));
      
      setSelectedStudents([]);
      toast({
        title: "Success",
        description: "Attendance updated successfully!",
      });
    } catch (error) {
      // Recharge les données en cas d'erreur
      await loadData();
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error updating attendance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-emerald-50/30 to-teal-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-8 py-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Attendance Management" className="text-white font-bold text-2xl" />
            <p className="text-emerald-100 text-sm mt-1">Track and manage student attendance</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <label className="text-sm font-medium text-white">Date:</label>
            <input
              className="bg-white/20 backdrop-blur-sm text-white text-sm focus:outline-none rounded-lg px-2 py-1 border border-white/30"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
            <ClassSelect />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 space-y-6">

        {/* Enhanced Action Bar */}
        <div className="flex flex-wrap gap-4 justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm rounded-xl font-medium"
            onClick={() => changeView(views.GENERAL_VIEW)}
            title="Back to general view"
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Overview</span>
          </Button>

          <div className="flex flex-wrap gap-3">
            {isToday && !hasAttendances && (
              <>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 rounded-xl px-4 py-2 shadow-lg font-medium"
                  onClick={() => setShowInitModal(true)}
                  title="Create new attendance"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Attendance</span>
                </Button>

                <Dialog open={showInitModal} onOpenChange={setShowInitModal}>
                  <DialogContent className="max-w-md">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                          <Plus className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Create Attendance</h2>
                      </div>
                      <p className="text-sm text-gray-600">
                        This will initialize a new attendance sheet for {attendanceDate}.
                      </p>
                      <div className="flex gap-2 justify-end pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowInitModal(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleInitializeAttendances}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Confirm"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {selectedStudents.length > 0 && (
              <div className="flex gap-3 border-l border-gray-300 pl-4 ml-4">
                <div className="bg-gray-50 px-3 py-2 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">{selectedStudents.length} selected</span>
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 rounded-xl px-3 py-2"
                  onClick={() => updateAttendanceStatus('present')}
                  title="Mark as present"
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Present</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 rounded-xl px-3 py-2"
                  onClick={() => updateAttendanceStatus('absent')}
                  title="Mark as absent"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                  <span className="text-sm">Absent</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200 rounded-xl px-3 py-2"
                  onClick={() => updateAttendanceStatus('late')}
                  title="Mark as late"
                  disabled={isLoading}
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Late</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 rounded-xl px-3 py-2"
                  onClick={() => updateAttendanceStatus('excused')}
                  title="Mark as excused"
                  disabled={isLoading}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Excused</span>
                </Button>
              </div>
            )}

            <div className="flex gap-3 border-l border-gray-300 pl-4 ml-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 rounded-xl px-3 py-2"
                onClick={() => setShowReportDialog(true)}
                title="Generate report"
                disabled={isLoading}
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm">Report</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 rounded-xl px-3 py-2"
                title="Print attendance"
                asChild
                disabled={isLoading}
              >
                <Link href="/assets/google_search.pdf" target="_blank">
                  <Printer className="h-4 w-4" />
                  <span className="text-sm">Print</span>
                </Link>
              </Button>

              {isAttendanceDatePast && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 rounded-xl px-3 py-2"
                  title="Edit attendance"
                  onClick={() => setIsAttendanceDatePast(false)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        <ReportAttendanceDialog 
          open={showReportDialog} 
          onOpenChange={setShowReportDialog} 
        />

        {/* Enhanced Attendance Table Card */}
        <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <AttendanceTable
            currentDate={attendanceDate}
            isAttendanceDatePast={isAttendanceDatePast}
            onAttendancesLoaded={(data) => setHasAttendances(data.length > 0)}
            onInitializeAttendances={handleInitializeAttendances}
            onEditAttendance={() => setIsAttendanceDatePast(false)}
          />
        </Card>
      </div>
    </section>
  );
}