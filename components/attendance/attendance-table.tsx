/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AttendanceItem from "../ui/attendance-item";
import { getAttendances, getStudentAttendanceStats, updateAttendance, updateMultipleAttendances } from "@/services/AttendanceService";
import { Loader } from "../ui/loader";
import { useRequestInfo } from "@/hooks/useRequestInfo";
//import NoData from "../ui/no-data";
import { useEffect, useState } from "react";
import { localStorageKey } from "@/constants/global";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import toast from "react-hot-toast";
import { Plus, } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  half_day: number;
  total: number;
}

interface EnhancedAttendance {
  attendance_id: number;
  student: {
    id: number;
    user: {
      username: string;
      first_name?: string;
      last_name?: string;
    };
  };
  status: 'present' | 'absent' | 'late' | 'half_day';
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const StatBadge = ({ value, color, title }: { value: number; color: string; title: string }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200'
  };
  
  return (
    <span 
      className={`text-xs font-medium px-2 py-1 rounded-full border ${colorClasses[color as keyof typeof colorClasses]}`}
      title={title}
    >
      {value}
    </span>
  );
};

export function AttendanceTable({
  isAttendanceDatePast,
  currentDate,
  onAttendancesLoaded,
  onInitializeAttendances,
  //onEditAttendance,
}: {
  isAttendanceDatePast: boolean;
  currentDate: string;
  onAttendancesLoaded?: (attendances: any[]) => void;
  onInitializeAttendances?: () => void;
  onEditAttendance?: () => void;
}) {
  const [attendances, setAttendances] = useState<EnhancedAttendance[]>([]);
  const [stats, setStats] = useState<Record<number, AttendanceStats>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>("present");
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const { id: currentClassId } = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingStudentId, setUpdatingStudentId] = useState<number | null>(null);
  const [showInitModal, setShowInitModal] = useState(false);
  //const isToday = new Date().toISOString().split("T")[0] === currentDate;

  const loadData = async () => {
    setIsLoading(true);
    if (tenantDomain && accessToken && refreshToken) {
      try {
        const data = await getAttendances(
          {
            date: currentDate,
            class_id: currentClassId,
            teacher_id: userData.owner_id,
          },
          tenantDomain,
          accessToken,
          refreshToken
        );

        setAttendances(data);

        // Load statistics for each student
        const statsPromises = data.map((attendance: any) =>
          loadStudentStats(attendance.student.id)
        );
        await Promise.all(statsPromises);

        if (onAttendancesLoaded) {
          onAttendancesLoaded(data);
        }
      } catch (error) {
        console.error("Failed to load attendances:", error);
        toast.error("Failed to load attendances");
        if (onAttendancesLoaded) {
          onAttendancesLoaded([]);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [currentDate, currentClassId, tenantDomain, accessToken, refreshToken, onAttendancesLoaded]);

  const loadStudentStats = async (studentId: number) => {
    try {
      setUpdatingStudentId(studentId);
      const data = await getStudentAttendanceStats(
        studentId,
        tenantDomain!,
        accessToken!,
        refreshToken!
      );
      
      setStats(prev => ({
        ...prev,
        [studentId]: data
      }));
    } catch (error) {
      console.error(`Failed to load stats for student ${studentId}:`, error);
      // Set default values if error occurs
      setStats(prev => ({
        ...prev,
        [studentId]: {
          present: 0,
          absent: 0,
          late: 0,
          half_day: 0,
          total: 0
        }
      }));
    } finally {
      setUpdatingStudentId(null);
    }
  };

  const handleUpdateAttendance = async (attendance: any) => {
    if (accessToken && refreshToken && tenantDomain) {
      try {
        setIsUpdating(true);
        const oldStatus = attendance.status;
        const newStatus = attendance.newStatus;

        // Optimistic UI update
        setAttendances(prev => prev.map(a => 
          a.attendance_id === attendance.attendance_id 
            ? { ...a, status: newStatus }
            : a
        ));

        // Send update to server
        await updateAttendance(
          {
            ...attendance,
            status: newStatus,
            oldStatus // Send old status to server
          },
          tenantDomain,
          accessToken,
          refreshToken
        );

        // Reload stats after short delay
        setTimeout(() => {
          loadStudentStats(attendance.student.id);
        }, 300);

        toast.success("Attendance status updated successfully!");
      } catch (error) {
        console.error("Failed to update attendance:", error);
        toast.error("Failed to update attendance");
        // Revert to old status if error occurs
        setAttendances(prev => prev.map(a => 
          a.attendance_id === attendance.attendance_id 
            ? { ...a, status: attendance.status }
            : a
        ));
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSelectStudent = (attendanceId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedStudents([...selectedStudents, attendanceId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== attendanceId));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }
  
    setIsUpdating(true);
    const toastId = toast.loading("Updating attendances...");
    
    try {
      const updates = attendances
        .filter(att => selectedStudents.includes(att.attendance_id))
        .map(att => ({
          attendance_id: att.attendance_id,
          status: bulkStatus,
          notes: "Bulk update",
          oldStatus: att.status // Keep track of old status
        }));
  
      await updateMultipleAttendances(
        { updates },
        tenantDomain!,
        accessToken!,
        refreshToken!
      );

      // Optimistic update
      setAttendances(prev => prev.map(a => 
        selectedStudents.includes(a.attendance_id)
          ? { ...a, status: bulkStatus as any }
          : a
      ));

      // Reload all data after bulk update
      await loadData();

      setSelectedStudents([]);
      toast.success("Attendances updated successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to update attendances:", error);
      toast.error("Failed to update attendances", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedStudents(attendances.map(att => att.attendance_id));
    } else {
      setSelectedStudents([]);
    }
  };

  return (
    <div className="w-full overflow-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {attendances.length > 0 ? (
            <>
              {selectedStudents.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {selectedStudents.length} selected
                    </span>
                    <Select 
                      value={bulkStatus} 
                      onValueChange={setBulkStatus}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="half_day">Half Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    size="sm"
                    onClick={handleBulkUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </div>
                    ) : (
                      "Update Selected"
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedStudents([])}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={selectedStudents.length === attendances.length && attendances.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>STUDENT</TableHead>
                    <TableHead>ATTENDANCE</TableHead>
                    <TableHead>STATISTICS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.map((attendance) => (
                    <TableRow key={attendance.attendance_id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(attendance.attendance_id)}
                          onCheckedChange={(checked) => 
                            handleSelectStudent(attendance.attendance_id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>{attendance.student.user.first_name} {attendance.student.user.last_name}</TableCell>
                      <TableCell>
                        <AttendanceItem
                          label={attendance.status}
                          isAttendanceDatePast={isAttendanceDatePast}
                          handleChange={(newStatus: string) =>
                            handleUpdateAttendance({
                              ...attendance,
                              newStatus,
                              oldStatus: attendance.status
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {updatingStudentId === attendance.student.id ? (
                          <Loader className="h-4 w-4" />
                        ) : stats[attendance.student.id] ? (
                          <div className="flex gap-2">
                            <StatBadge 
                              value={stats[attendance.student.id].present}
                              color="green"
                              title="Present"
                            />
                            <StatBadge 
                              value={stats[attendance.student.id].absent}
                              color="red"
                              title="Absent"
                            />
                            <StatBadge 
                              value={stats[attendance.student.id].late}
                              color="yellow"
                              title="Late"
                            />
                            <StatBadge 
                              value={stats[attendance.student.id].half_day}
                              color="orange"
                              title="Half Day"
                            />
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <StatBadge value={0} color="green" title="Present" />
                            <StatBadge value={0} color="red" title="Absent" />
                            <StatBadge value={0} color="yellow" title="Late" />
                            <StatBadge value={0} color="orange" title="HalfDay" />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="flex flex-wrap gap-2 justify-center">
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
                        This will initialize a new attendance sheet for {currentDate}.
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
                          onClick={() => {
                            if (onInitializeAttendances) {
                              onInitializeAttendances();
                            }
                            setShowInitModal(false);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Confirm"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-gray-500">
                No attendance records found for this date. Click the plus button to create a new attendance sheet.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}