/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import PageTitleH2 from "../ui/page-title-h2";
import StudentArrangementItem from "./student-arrangement-item";
import { useEffect, useState } from "react";
import StudentSeatingConditionsDialog from "./StudentSeatingConditionsDialog";
import { assignRandomSeatNumbers } from "@/libs/utils";
import { CreateArrangementDialog } from "./CreateArrangementDialog";
import { SeatingHistory } from "./SeatingHistory";
import { useCallback,useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
//import ClassSelect from "../ClassSelect";
import { getSeatingArrangements, updateSeatingArrangement, deactivateArrangementEvent } from "@/services/SeatingService";
import { ClassSelector } from "../ui/class-selector";

const totalSeats = 64;

export default function Seating({
  tenantPrimaryDomain,
  accessToken,
  refreshToken,
  courses,
}: {
  tenantPrimaryDomain: string;
  accessToken: string;
  refreshToken: string;
  courses: any[];
}) {
  const [arrangements, setArrangements] = useState<any[]>([]);
  const [currentArrangement, setCurrentArrangement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse,] = useState<number | null>(null);
  const [firstSelectedSeatNumber, setFirstSelectedSeatNumber] = useState(-1);
  const [isSeatingArrangementAuto, setIsSeatingArrangementAuto] = useState(true);
  const [displayStudentsList, setDisplayStudentsList] = useState(true);
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [eventToDeactivate, setEventToDeactivate] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentClassId,] = useState<string | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  //const [seatingConditions, setSeatingConditions] = useState<SeatingCondition[]>([]);

  const loadArrangements = useCallback(async (courseId?: number) => {
    try {
      setLoading(true);
      const data = await getSeatingArrangements(tenantPrimaryDomain, accessToken, courseId);
      const formattedArrangements = formatArrangements(data);
      setArrangements(formattedArrangements);

      if (formattedArrangements.length > 0) {
        setCurrentArrangement(formattedArrangements[0]);
      }
    } catch (error) {
      console.error("Error loading arrangements:", error);
    } finally {
      setLoading(false);
    }
  }, [tenantPrimaryDomain, accessToken]);

  const formatArrangements = useCallback((apiData: any) => {
    console.log()
    const result: any[] = [];
    
    for (const courseName in apiData) {
      const courseData = apiData[courseName];

      for (const eventName in courseData) {
        const eventData = courseData[eventName];
        const students = [];

        // Check if seating_data exists and is not empty
        if (eventData.seating_data && Object.keys(eventData.seating_data).length > 0) {
          for (const siteNumber in eventData.seating_data) {
            const studentData = eventData.seating_data[siteNumber];
            students.push({
              seatNumber: parseInt(siteNumber),
              studentImageUrl: studentData.student_profile_picture || generalImages.student,
              studentName: studentData.full_name,
              studentId: studentData.student_id,
              seatingId: studentData.seating_arrangement_id,
            });
          }
        }

        result.push({
          id: eventData.arrangement_event_id.toString(),
          title: eventData.name,
          courseName,
          arrangements: students,
          is_active: eventData.is_active,
          course_id: eventData.course_id,
        });
      }
    }

    return result;
  }, []);

  const filteredStudents = useMemo(() => {
    if (!currentArrangement) return [];
    if (!searchTerm) return currentArrangement.arrangements;
  
    return currentArrangement.arrangements.filter((student: any) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentArrangement, searchTerm]);

  const handleSeatClick = useCallback(async (targetSeatNumber: number) => {
    const targetStudent = currentArrangement.arrangements.find(
      (s: any) => s.seatNumber === targetSeatNumber
    );
  
    if (!targetStudent && firstSelectedSeatNumber === -1) {
      return;
    }
  
    if (firstSelectedSeatNumber === -1) {
      if (targetStudent) {
        setFirstSelectedSeatNumber(targetSeatNumber);
      }
      return;
    }
  
    if (firstSelectedSeatNumber === targetSeatNumber) {
      setFirstSelectedSeatNumber(-1);
      return;
    }

    const firstStudent = currentArrangement.arrangements.find(
      (s: any) => s.seatNumber === firstSelectedSeatNumber
    );

    if (!firstStudent) {
      setFirstSelectedSeatNumber(-1);
      return;
    }
  
    try {  
      const newArrangements = currentArrangement.arrangements.map(
        (student: any) => {
          if (student.seatNumber === firstSelectedSeatNumber) {
            return { ...student, seatNumber: targetSeatNumber };
          }
          if (targetStudent && student.seatNumber === targetSeatNumber) {
            return { ...student, seatNumber: firstSelectedSeatNumber };
          }
          return student;
        }
      );
  
      const newCurrentArrangement = {
        ...currentArrangement,
        arrangements: newArrangements,
      };
  
      setCurrentArrangement(newCurrentArrangement);
      setArrangements(
        arrangements.map((arr) =>
          arr.id === currentArrangement.id ? newCurrentArrangement : arr
        )
      );
      setIsModified(true);
    } catch (error) {
      console.error("Error moving student:", error);
    } finally {
      setFirstSelectedSeatNumber(-1);
    }
  }, [currentArrangement, firstSelectedSeatNumber, arrangements, tenantPrimaryDomain, accessToken]);

  const handleSeatingArrangementAuto = useCallback(() => {
    if (!currentArrangement) return;

    const shuffledArrangements = assignRandomSeatNumbers(
      currentArrangement.arrangements,
      totalSeats
    );

      const newCurrentArrangement = {
        ...currentArrangement,
        arrangements: shuffledArrangements,
      };
      setCurrentArrangement(newCurrentArrangement);
      setArrangements(
        arrangements.map((arr) =>
          arr.id === currentArrangement.id ? newCurrentArrangement : arr
        )
      );
      setIsSeatingArrangementAuto(true);
      setIsModified(true);
    }, [currentArrangement, arrangements]);

    const handleSave = useCallback(async () => {
  if (!currentArrangement || !isModified) return;

  try {
    setIsSaving(true);
    const updates = currentArrangement.arrangements.map((student: any) => ({
      seating_id: student.seatingId,
      site_number: student.seatNumber
    }));
    
    await updateSeatingArrangement(
      tenantPrimaryDomain,
      accessToken,
      updates
    );
    
    setIsModified(false);
  } catch (error) {
    console.error("Error saving arrangement:", error);
  } finally {
    setIsSaving(false);
  }
}, [currentArrangement, isModified, tenantPrimaryDomain, accessToken]);

  const handleDeactivateEvent = useCallback(async (eventId: number) => {
    setEventToDeactivate(eventId);
    setIsConfirmDialogOpen(true);
  }, []);
  
  const confirmDeactivation = useCallback(async () => {
    if (!eventToDeactivate) return;
  
    try {
      setIsDeactivating(true);
      await deactivateArrangementEvent(tenantPrimaryDomain, accessToken, eventToDeactivate);
      await loadArrangements(selectedCourse || undefined);
    } catch (error) {
      console.error("Error deactivating event:", error);
    } finally {
      setIsDeactivating(false);
      setIsConfirmDialogOpen(false);
      setEventToDeactivate(null);
    }
  }, [eventToDeactivate, tenantPrimaryDomain, accessToken, selectedCourse, loadArrangements]);

  const GridComponent = useMemo(() => (
    <div className="grid grid-cols-8 gap-2 p-2 border-2 border-gray-200"> 
      {currentArrangement?.arrangements?.length > 0 ? (
        <>
          {Array.from({ length: totalSeats }).map((_, index) => {
            if (index === 0) return null;
  
            const student = currentArrangement.arrangements.find(
              (s: any) => s.seatNumber === index
            );
  
            return student ? (
              <StudentArrangementItem
                key={`student-${student.studentId}-${index}`}
                id={index}
                studentImageUrl={student.studentImageUrl}
                studentName={student.studentName}
                className={`w-full h-[50px]`} 
                handleSeatClick={() => handleSeatClick(index)}
                maxSeatNumber={currentArrangement.arrangements.length}
                isSeatingArrangementAuto={isSeatingArrangementAuto}
                isSelected={firstSelectedSeatNumber === index}
              />
            ) : (
              <div
                key={`empty-${index}`}
                onClick={() => handleSeatClick(index)}
                className={`w-full h-[50px] bg-gray-200 border-[1px] border-[#eee] hover:border-[1px] hover:border-bgPink relative
                  ${firstSelectedSeatNumber === -1 ? 'cursor-pointer' : 'cursor-move'}`}
              >
                <label className="seat-number font-bold text-xs text-bgPurple absolute top-1 left-1">
                  {index}
                </label>
              </div>
            );
          })}
        </>
      ) : (
        <div className="col-span-8 flex items-center justify-center h-[400px]">
          <label className="text-muted-foreground">
            {arrangements.length === 0
              ? "No arrangements found. Create one!"
              : "No students in this arrangement"}
          </label>
        </div>
      )}
    </div>
  ), [currentArrangement, firstSelectedSeatNumber, isSeatingArrangementAuto, handleSeatClick]);
    

  useEffect(() => {
    loadArrangements();
  }, []);

  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="SEATING" />

        
        <ClassSelector
            classes={Array.from(new Set(arrangements.map(arr => arr.courseName))).map(courseName => ({
              id: courseName,
              name: courseName
            }))}
            selectedClasses={selectedClasses}
            onSelect={(classIds) => {
              setSelectedClasses(classIds);
            }}
            placeholder="Select classes..."
            multiple={true}
            className="w-[250px] "
          />
      </div>

      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-lg shadow-sm">
        <Button
          onClick={handleSeatingArrangementAuto}
          className={`flex gap-2 items-center text-lg rounded-md px-4 py-3 shadow-md transition-all ${
            isSeatingArrangementAuto 
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          <Image
            src={teacherImages.autogenerate}
            alt="autogenerate"
            width={24}
            height={24}
            className="w-5 h-5"
          />
          <span>Auto Generate</span>
        </Button>

        <Button
          onClick={() => setIsSeatingArrangementAuto(false)}
          className={`flex gap-2 items-center text-lg rounded-md px-4 py-3 shadow-md transition-all ${
            !isSeatingArrangementAuto 
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-purple-100 text-purple-600 hover:bg-purple-200"
          }`}
        >
          <Image
            src={teacherImages.manual}
            alt="manual"
            width={24}
            height={24}
            className="w-5 h-5"
          />
          <span>Manual</span>
        </Button>

        <StudentSeatingConditionsDialog 
          studentClassName="flex gap-2 items-center text-lg bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-3 shadow-md transition-all"
        />

        <CreateArrangementDialog
          courses={courses}
          tenantPrimaryDomain={tenantPrimaryDomain}
          accessToken={accessToken}
          refreshToken={refreshToken}
          onSuccess={() => loadArrangements(selectedCourse || undefined)}
        />

        <Button className="flex gap-2 items-center text-lg bg-blue-400 hover:bg-blue-500 text-white rounded-md px-4 py-3 shadow-md transition-all">
          <Image
            src={generalImages.print}
            alt="print"
            width={24}
            height={24}
            className="w-5 h-5"
          />
          <span>Print</span>
        </Button>

        
      </div>
      <Card className="rounded-md">
      {loading ? (
          <div className="flex items-center justify-center ">
            <div className="flex flex-col items-center p-4 gap-1">
              <video
                src="/assets/videos/general/drea_metrix_loader.mp4"
                autoPlay
                loop
                muted
                className="w-[150px] h-[150px] object-contain"
              />
              <label className="mt-0 text-sm text-slate-500">Loading data...</label>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap-reverse">
          <div className="flex flex-col gap-6 flex-1 py-4 px-4">
          <div className="flex justify-between items-center pb-4 border-b-[1px] border-[#eee]">
              <div>
                <PageTitleH2 title="ARRANGEMENT" />
                <label className="text-muted-foreground">BLACKBOARD</label>
              </div>

            <div className="flex flex-col items-end">
              <div>
              <Button
                onClick={handleSave}
                disabled={!isModified || isSaving}
                className={`flex gap-2 items-center text-lg h-[35px] rounded-md px-4 py-2 transition-all ${
                  isModified 
                    ? "bg-green-500 hover:bg-green-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                isLoading={isSaving}
              >
                <Image
                  src={teacherImages.save}
                  alt="save"
                  width={24}
                  height={24}
                  className="w-5 h-5"
                />
                <span>Save</span>
              </Button>
              </div>

              
            </div>
            </div>
            <div className="flex">
            <div className="w-[20%] flex flex-col gap-2 pr-4">
              <span
                title="Students List"
                className="flex justify-center items-center h-[25px] w-[25px] bg-blue-500 p- text-white border-2 border-gray-200 rounded-md cursor-pointer"
                onClick={() => setDisplayStudentsList(!displayStudentsList)}
              >
                {displayStudentsList ? <>&#128473;</> : <>☰</>}
              </span>

              {displayStudentsList && currentArrangement && (
                <div className="flex-1 overflow-auto">
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((arrangement: any) => (
                      <label
                        key={arrangement.studentId}
                        className={`block whitespace-nowrap text-[14px] cursor-pointer border-b-2 py-1 ${
                          firstSelectedSeatNumber === arrangement.seatNumber 
                            ? "border-blue-500 bg-blue-50" 
                            : "border-gray-200"
                        }`}
                        onClick={() => {
                          if (firstSelectedSeatNumber === arrangement.seatNumber) {
                            setFirstSelectedSeatNumber(-1);
                          } else {
                            setFirstSelectedSeatNumber(arrangement.seatNumber);
                          }
                        }}
                      >
                        <span className="text-muted-foreground">{arrangement.studentName}</span>
                        (<span className="text-secondaryBtn">{arrangement.seatNumber}</span>)
                      </label>
                    ))
                  ) : (
                    <div className="text-center text-sm text-gray-500 py-4">
                      No students found matching &quot;{searchTerm}&quot;
                    </div>
                  )}
                </div>
                )}

              {currentArrangement && (
                <Button
                className="flex gap-2 items-center h-[25px] text-lg bg-red-500 hover:bg-red-700 text-white rounded-md px-4 py-5  shadow-md transition-all mt-4"
                onClick={() => handleDeactivateEvent(parseInt(currentArrangement.id))}
                isLoading={isDeactivating}
                  >
                    <Image
                      src={teacherImages.delete}
                      alt="delete"
                      width={20}
                      height={24}
                      className="w-5 h-5"
                    />
                    <span>Deactivate</span>
                  </Button>
              )}
            </div>

            <div className="w-[80%]">
            {GridComponent}
          </div>
          </div>
          </div>
          <div className="">
          <SeatingHistory
            arrangements={arrangements.filter(arr => 
              selectedClasses.length === 0 || selectedClasses.includes(arr.courseName)
            )}
            currentArrangement={currentArrangement}
            setCurrentArrangement={setCurrentArrangement}
            tenantPrimaryDomain={tenantPrimaryDomain}
            accessToken={accessToken}
            refreshToken={refreshToken}
            onReactivate={() => loadArrangements(currentClassId ? parseInt(currentClassId) : undefined)}
            currentClass={currentClassId}
          />
          </div>
        </div>
        )}
        
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deactivation</DialogTitle>
              <DialogDescription>
                Are you sure you want to deactivate this seating arrangement? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDeactivation}
                isLoading={isDeactivating}
              >
                Confirm Deactivation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </section>
  );
}