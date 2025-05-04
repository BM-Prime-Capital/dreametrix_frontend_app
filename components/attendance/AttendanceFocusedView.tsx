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
import { Plus, Pencil, Printer, LayoutDashboard, FileText } from "lucide-react";
import ClassSelect from "../ClassSelect";
import { views } from "@/constants/global";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { initializeAttendances } from "@/services/AttendanceService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { localStorageKey } from "@/constants/global";

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
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const { id: currentClassId } = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
  );

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setIsAttendanceDatePast(new Date(attendanceDate) < new Date(currentDate));
    setIsToday(attendanceDate === currentDate);
  }, [attendanceDate]);

  const handleInitializeAttendances = async () => {
    try {
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
      setHasAttendances(true);
      alert("Attendance list created successfully!");
    } catch (error: any) {
      alert(error.message || "Error creating attendance list");
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
        <div className="flex gap-2">
          {/* Create Attendance Button */}
          {isToday && !hasAttendances && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200"
                onClick={() => setShowInitModal(true)}
                title="Create new attendance"
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
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setShowInitModal(false);
                          handleInitializeAttendances();
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          {/* Report Button (seule icône visible) */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            onClick={() => setShowReportDialog(true)}
            title="Generate report"
          >
            <FileText className="h-4 w-4" />
          </Button>

          {/* Print Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            title="Print attendance"
            asChild
          >
            <Link target="_blank" href="/assets/google_search.pdf">
              <Printer className="h-4 w-4 text-gray-600" />
            </Link>
          </Button>

          {/* Edit Button */}
          {isAttendanceDatePast && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
              title="Edit attendance"
              onClick={() => setIsAttendanceDatePast(false)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* General View Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-600 hover:text-gray-900"
          onClick={() => changeView(views.GENERAL_VIEW)}
          title="General view"
        >
          <LayoutDashboard className="h-4 w-4" />
        </Button>
      </div>

      {/* Report Dialog (contrôlé par le parent) */}
      <ReportAttendanceDialog 
        open={showReportDialog} 
        onOpenChange={setShowReportDialog} 
      />

      <Card className="rounded-lg border shadow-sm">
        <AttendanceTable
          currentDate={attendanceDate}
          isAttendanceDatePast={isAttendanceDatePast}
          onAttendancesLoaded={(attendances) =>
            setHasAttendances(attendances.length > 0)
          }
        />
      </Card>
    </section>
  );
}