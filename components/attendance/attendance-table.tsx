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
import { getAttendances, updateAttendance, updateMultipleAttendances } from "@/services/AttendanceService";
import { Loader } from "../ui/loader";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import NoData from "../ui/no-data";
import { useEffect, useState } from "react";
import { localStorageKey } from "@/constants/global";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import toast, { ToastOptions } from "react-hot-toast";


export function AttendanceTable({
  isAttendanceDatePast,
  currentDate,
  onAttendancesLoaded,
}: {
  isAttendanceDatePast: boolean;
  currentDate: string;
  onAttendancesLoaded?: (attendances: any[]) => void;
}) {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>("present");
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const { id: currentClassId } = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
  );

  const loadAttendances = async () => {
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

  const handleUpdateAttendance = async (attendance: any) => {
    if (accessToken && refreshToken && tenantDomain) {
      try {
        await updateAttendance(
          attendance,
          tenantDomain!,
          accessToken!,
          refreshToken!
        );
        toast.success("Attendance updated successfully!");
        loadAttendances(); // Recharger les données après mise à jour
      } catch (error) {
        toast.error("Failed to update attendance");
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


  // const handleBulkUpdate = async () => {
  //   if (selectedStudents.length === 0) {
  //     toast.error("Please select at least one student");
  //     return;
  //   }
  
  //   // Créer le toast de chargement
  //   const toastId = toast.loading("Updating attendances...");
    
  //   try {
  //     const updates = attendances
  //       .filter(att => selectedStudents.includes(att.attendance_id))
  //       .map(att => ({
  //         attendance_id: att.attendance_id,
  //         status: bulkStatus,
  //         notes: "Bulk update"
  //       }));
  
  //     await updateMultipleAttendances(
  //       { updates },
  //       tenantDomain!,
  //       accessToken!,
  //       refreshToken!
  //     );
  
  //     await loadAttendances();
  //     setSelectedStudents([]);
      
  //     // Mettre à jour le toast existant
  //     toast.success("Attendances updated successfully!", { 
  //       id: toastId 
  //     } as ToastOptions);
      
  //   } catch (error) {
  //     // Mettre à jour le toast existant avec l'erreur
  //     toast.error("Failed to update attendances", { 
  //       id: toastId 
  //     } as ToastOptions);
  //   }
  // };

  const [isUpdating, setIsUpdating] = useState(false);

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
          notes: "Bulk update"
        }));
  
      await updateMultipleAttendances(
        { updates },
        tenantDomain!,
        accessToken!,
        refreshToken!
      );
  
      await loadAttendances();
      setSelectedStudents([]);
      toast.success("Attendances updated successfully!", { id: toastId });
    } catch (error) {
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

  useEffect(() => {
    const loadAttendances = async () => {
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
          if (onAttendancesLoaded) {
            onAttendancesLoaded(data);
          }
        } catch (error) {
          console.error("Failed to load attendances:", error);
          if (onAttendancesLoaded) {
            onAttendancesLoaded([]);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAttendances();
  }, [
    tenantDomain,
    accessToken,
    refreshToken,
    currentDate,
    currentClassId,
    onAttendancesLoaded,
  ]);

  return (
    <div className="w-full overflow-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {attendances.length > 0 ? (
            <>
              {/* Bulk Actions Toolbar */}
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
                  {attendances.map((attendance: any) => (
                    <TableRow key={attendance.attendance_id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(attendance.attendance_id)}
                          onCheckedChange={(checked) => 
                            handleSelectStudent(attendance.attendance_id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>{attendance.student.user.username}</TableCell>
                      <TableCell>
                        <AttendanceItem
                          label={attendance.status ? attendance.status : "absent"}
                          isAttendanceDatePast={isAttendanceDatePast}
                          handleChange={(status: string) =>
                            handleUpdateAttendance({
                              ...attendance,
                              status: status,
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-8">
                          <span className="border-b-4 border-bgGreenLight2">
                            {0}
                          </span>
                          <span className="border-b-4 border-bgPinkLight2">
                            {0}
                          </span>
                          <span className="border-b-4 border-bgYellow">{0}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <NoData/>
          )}
        </>
      )}
    </div>
  );
}