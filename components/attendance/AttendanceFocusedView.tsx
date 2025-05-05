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
import { Plus, Pencil, Printer, LayoutDashboard, FileText, Check, X, Clock, AlertCircle } from "lucide-react";
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
    <section className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="Attendance Management" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-gray-200">
            <label className="text-sm font-medium text-gray-600">Date:</label>
            <input
              className="bg-transparent text-sm focus:outline-none"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>
          <ClassSelect />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {isToday && !hasAttendances && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200"
                onClick={() => setShowInitModal(true)}
                title="Create new attendance"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
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
            <div className="flex gap-2 border-l border-gray-200 pl-2 ml-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                onClick={() => updateAttendanceStatus('present')}
                title="Mark as present"
                disabled={isLoading}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                onClick={() => updateAttendanceStatus('absent')}
                title="Mark as absent"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200"
                onClick={() => updateAttendanceStatus('late')}
                title="Mark as late"
                disabled={isLoading}
              >
                <Clock className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                onClick={() => updateAttendanceStatus('excused')}
                title="Mark as excused"
                disabled={isLoading}
              >
                <AlertCircle className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            onClick={() => setShowReportDialog(true)}
            title="Generate report"
            disabled={isLoading}
          >
            <FileText className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            title="Print attendance"
            asChild
            disabled={isLoading}
          >
            <Link href="/assets/google_search.pdf" target="_blank">
              <Printer className="h-4 w-4 text-gray-600" />
            </Link>
          </Button>

          {isAttendanceDatePast && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
              title="Edit attendance"
              onClick={() => setIsAttendanceDatePast(false)}
              disabled={isLoading}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-600 hover:text-gray-900"
          onClick={() => changeView(views.GENERAL_VIEW)}
          title="General view"
          disabled={isLoading}
        >
          <LayoutDashboard className="h-4 w-4" />
        </Button>
      </div>

      <ReportAttendanceDialog 
        open={showReportDialog} 
        onOpenChange={setShowReportDialog} 
      />

      <Card className="rounded-lg border shadow-sm">

        <AttendanceTable
          currentDate={attendanceDate}
          isAttendanceDatePast={isAttendanceDatePast}
        />
      </Card>
    </section>
  );
}