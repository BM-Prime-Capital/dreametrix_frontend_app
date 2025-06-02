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
import { useCallback } from 'react';
//import { CourseSelect } from "../CourseSelect";
import ClassSelect from "../ClassSelect";
import { getSeatingArrangements, updateSeatingArrangement, deactivateArrangementEvent } from "@/services/SeatingService";

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
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [firstSelectedSeatNumber, setFirstSelectedSeatNumber] = useState(-1);
  const [isSeatingArrangementAuto, setIsSeatingArrangementAuto] = useState(true);
  const [displayStudentsList, setDisplayStudentsList] = useState(true);
  const [isModified, setIsModified] = useState(false);
  
  //const [currentClass, setCurrentClass] = useState<string | null>(null);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);

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
    const result: any[] = [];

    for (const courseName in apiData) {
      const courseData = apiData[courseName];

      for (const eventName in courseData) {
        const eventData = courseData[eventName];
        const students = [];

        for (const siteNumber in eventData) {
          students.push({
            seatNumber: parseInt(siteNumber),
            studentImageUrl: eventData[siteNumber].student_profile_picture || generalImages.student,
            studentName: eventData[siteNumber].full_name,
            studentId: eventData[siteNumber].student_id,
            seatingId: eventData[siteNumber].site_number,
          });
        }

        console.log('eventData', eventData)

        result.push({
          id: `${courseName}-${eventName}`,
          title: eventName,
          courseName,
          arrangements: students,
        });
      }
    }

    return result;
  }, []);

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

    console.log("currentArrangement", currentArrangement.arrangements);
    
    try {
      await Promise.all(
        currentArrangement.arrangements.map((student: any) =>
          updateSeatingArrangement(
            tenantPrimaryDomain,
            accessToken,
            student.seatingId,
            student.seatNumber
          )
        )
      );
      
      setIsModified(false);
      
      await loadArrangements(selectedCourse || undefined);
      
    } catch (error) {
      console.error("Error saving arrangement:", error);
    }
  }, [currentArrangement, isModified, tenantPrimaryDomain, accessToken, selectedCourse, loadArrangements]);

  // const handleCourseChange = (courseId: number) => {
  //   setSelectedCourse(courseId);
  //   loadArrangements(courseId);
  // };

  const handleDeactivateEvent = useCallback(async (eventId: number) => {
    try {
      await deactivateArrangementEvent(tenantPrimaryDomain, accessToken, eventId);
      loadArrangements(selectedCourse || undefined);
    } catch (error) {
      console.error("Error deactivating event:", error);
    }
  }, [tenantPrimaryDomain, accessToken, selectedCourse, loadArrangements]);

  useEffect(() => {
    loadArrangements();
  }, []);

  const handleClassChange = useCallback((classId: string) => {
    setCurrentClassId(classId);
    loadArrangements(classId ? parseInt(classId) : undefined);
  }, [loadArrangements]);


  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="SEATING" />
          <ClassSelect 
            className=""
            onClassChange={(classId) => {
              setCurrentClassId(classId);
              loadArrangements(classId ? parseInt(classId) : undefined);
            }}
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
              {isModified && (
                <span className="text-[10px] text-yellow-600 bg-yellow-100 px-3 py-2 rounded-sm">
                  You have unsaved changes.
                </span>
              )}

            <div className="flex flex-col items-end">
              <div>
                <Button
                  onClick={handleSave}
                  disabled={!isModified}
                  className={`flex gap-2 items-center text-[16px] h-[35px] rounded-md px-4 py-2 transition-all ${
                    isModified 
                      ? "bg-green-500 hover:bg-green-700 text-white shadow-md"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Image
                    src={teacherImages.save}
                    alt="save"
                    width={15}
                    height={5}
                    className="w-3 h-3"
                  />
                  <span>Save</span>
                </Button>
              </div>

              
            </div>
            </div>
            <div className="flex">
              <div>
                <div className="flex flex-col gap-2">
                  <span
                    title="Students List"
                    className="flex justify-center items-center h-[25px] w-[25px] bg-blue-500 p- text-white border-2 border-gray-200 rounded-md cursor-pointer"
                    onClick={() => setDisplayStudentsList(!displayStudentsList)}
                  >
                    {displayStudentsList ? <>&#128473;</> : <>☰</>}
                  </span>

                  {displayStudentsList && currentArrangement && (
                    <div className="w-[100px] flex flex-col overflow-auto mr-3">
                      {currentArrangement.arrangements.map((arrangement: any) => (
                        <label
                          key={arrangement.studentId}
                          className={`whitespace-nowrap text-[12px] cursor-pointer border-b-2 pr-2 ${
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
                      ))}
                    </div>
                  )}

                </div>
                <div className="mt-8">
                  {currentArrangement && (
                    <Button
                      className="flex gap-2 items-center w-[100px] h-[25px] text-[12px] bg-red-500 hover:bg-red-700 text-white rounded-md px-4 py-0 shadow-md transition-all"
                      onClick={() => handleDeactivateEvent(currentArrangement.id)}
                    >
                      <Image
                        src={teacherImages.delete}
                        alt="delete"
                        width={20}
                        height={5}
                        className="w-3 h-3"
                      />
                      <span>Deactivate</span>
                    </Button>
                  )}
                </div>
              </div>
              <div id="arrangementGrid" className="grid grid-cols-8 grid-row-8 border-2 gap-2 p-2 border-gray-200">
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
                          className={`order-${index}`}
                          handleSeatClick={() => handleSeatClick(index)}
                          maxSeatNumber={currentArrangement.arrangements.length}
                          isSeatingArrangementAuto={isSeatingArrangementAuto}
                          isSelected={firstSelectedSeatNumber === index}
                        />
                      ) : (
                        <div
                          key={`empty-${index}`}
                          onClick={() => handleSeatClick(index)}
                          className="seat w-full h-full p-5 bg-gray-200 border-[1px] border-[#eee] hover:border-[1px] hover:border-bgPink relative"
                        >
                          <label className="seat-number font-bold text-xs text-bgPurple absolute top-1 left-1">
                            {index}
                          </label>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex items-center justify-center col-span-8 row-span-8">
                    <label className="text-muted-foreground">
                      {arrangements.length === 0
                        ? "No arrangements found. Create one!"
                        : "No students in this arrangement"}
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-[150px]">
          <SeatingHistory
            arrangements={arrangements}
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
    </section>
  );
}
