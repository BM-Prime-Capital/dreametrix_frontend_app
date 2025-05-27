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
import { CourseSelect } from "../CourseSelect";
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

  const loadArrangements = async (courseId?: number) => {
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
  };

  const formatArrangements = (apiData: any) => {
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
            seatingId: eventData[siteNumber].id, // Assuming the API returns this
          });
        }

        result.push({
          id: `${courseName}-${eventName}`, // Create a unique ID
          title: eventName,
          courseName,
          arrangements: students,
        });
      }
    }

    return result;
  };

  const handleSeatClick = async (targetSeatNumber: number) => {
    if (firstSelectedSeatNumber === -1) {
      setFirstSelectedSeatNumber(targetSeatNumber);
      return;
    }

    // Find both students involved in the swap
    const firstStudent = currentArrangement.arrangements.find(
      (s: any) => s.seatNumber === firstSelectedSeatNumber
    );
    const secondStudent = currentArrangement.arrangements.find(
      (s: any) => s.seatNumber === targetSeatNumber
    );

    if (!firstStudent || !secondStudent) return;

    try {
      // Update both students' seat numbers in the API
      await Promise.all([
        updateSeatingArrangement(
          tenantPrimaryDomain,
          accessToken,
          firstStudent.seatingId,
          targetSeatNumber
        ),
        updateSeatingArrangement(
          tenantPrimaryDomain,
          accessToken,
          secondStudent.seatingId,
          firstSelectedSeatNumber
        ),
      ]);

      // Update local state
      const newArrangements = currentArrangement.arrangements.map(
        (student: any) => {
          if (student.seatNumber === firstSelectedSeatNumber) {
            return { ...student, seatNumber: targetSeatNumber };
          } else if (student.seatNumber === targetSeatNumber) {
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
    } catch (error) {
      console.error("Error swapping seats:", error);
    } finally {
      setFirstSelectedSeatNumber(-1);
    }
  };

  const handleSeatingArrangementAuto = () => {
    if (!currentArrangement) return;

    const shuffledArrangements = assignRandomSeatNumbers(
      currentArrangement.arrangements,
      totalSeats
    );

    // Update seat numbers in the API
    Promise.all(
      shuffledArrangements.map((student: any) =>
        updateSeatingArrangement(
          tenantPrimaryDomain,
          accessToken,
          student.seatingId,
          student.seatNumber
        )
      )
    ).then(() => {
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
    });
  };

  const handleCourseChange = (courseId: number) => {
    setSelectedCourse(courseId);
    loadArrangements(courseId);
  };

  const handleDeactivateEvent = async (eventId: number) => {
    try {
      await deactivateArrangementEvent(tenantPrimaryDomain, accessToken, eventId);
      loadArrangements(selectedCourse || undefined);
    } catch (error) {
      console.error("Error deactivating event:", error);
    }
  };

  useEffect(() => {
    loadArrangements();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="SEATING" />
        <div className="flex items-center gap-2">
          <ClassSelect />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleSeatingArrangementAuto}
          className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md px-2 py-4 lg:px-4 lg:py-6"
        >
          <Image
            src={teacherImages.autogenerate}
            alt="autogenerate"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span
            className={`${
              isSeatingArrangementAuto
                ? "bg-blue-50 text-blue-500 p-1 rounded-md"
                : ""
            }`}
          >
            Auto Generate
          </span>
        </Button>
        <Button
          onClick={() => setIsSeatingArrangementAuto(false)}
          className="flex gap-2 items-center text-lg bg-secondaryBtn hover:bg-[#cf4794] rounded-md px-2 py-4 lg:px-4 lg:py-6"
        >
          <Image
            src={teacherImages.manual}
            alt="manual"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span
            className={`${
              !isSeatingArrangementAuto
                ? "bg-[#f8e3ef] text-secondaryBtn p-1 rounded-md"
                : ""
            }`}
          >
            Manual
          </span>
        </Button>

        <StudentSeatingConditionsDialog studentClassName="" />

        <CreateArrangementDialog
          courses={courses}
          tenantPrimaryDomain={tenantPrimaryDomain}
          accessToken={accessToken}
          refreshToken={refreshToken}
          onSuccess={() => loadArrangements(selectedCourse || undefined)}
        />

        <Button className="flex gap-2 items-center text-lg bg-[#81B5E3] hover:bg-[#64a7e2] rounded-md px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={generalImages.print}
            alt="add"
            width={100}
            height={100}
            className="w-8 h-8"
          />
        </Button>

        {currentArrangement && (
          <Button
            variant="destructive"
            className="flex gap-2 items-center text-lg rounded-md px-2 py-4 lg:px-4 lg:py-6"
            onClick={() => handleDeactivateEvent(currentArrangement.id)}
          >
            <Image
              src={teacherImages.delete}
              alt="delete"
              width={100}
              height={100}
              className="w-8 h-8"
            />
            <span>Deactivate</span>
          </Button>
        )}
      </div>
      <Card className="rounded-md">
        <div className="flex flex-wrap-reverse">
          <div className="flex flex-col gap-6 flex-1 py-4 px-8">
            <div className="flex flex-col pb-4 border-b-[1px] border-[#eee]">
              <PageTitleH2 title="ARRANGEMENT" />
              <label className="text-muted-foreground">BLACKBOARD</label>
            </div>
            <div className="flex">
              <div className="flex flex-col gap-2">
                <span
                  title="Students List"
                  className="flex justify-center items-center h-[25px] w-[25px] bg-blue-500 p- text-white border-2 border-gray-200 rounded-md cursor-pointer"
                  onClick={() => setDisplayStudentsList(!displayStudentsList)}
                >
                  {displayStudentsList ? <>&#128473;</> : <>☰</>}
                </span>

                {displayStudentsList && currentArrangement && (
                  <>
                    {currentArrangement.arrangements.map((arrangement: any) => (
                      <label
                        key={arrangement.studentId}
                        className="whitespace-nowrap cursor-pointer border-b-2 border-gray-200 pr-2"
                        onClick={() => handleSeatClick(arrangement.seatNumber)}
                      >
                        <span className="text-muted-foreground">{`${arrangement.studentName} `}</span>
                        (
                        <span
                          title="Seat number"
                          className="text-secondaryBtn"
                        >
                          {arrangement.seatNumber}
                        </span>
                        )
                      </label>
                    ))}
                  </>
                )}
              </div>
              <div
                id="arrangementGrid"
                className="grid grid-cols-8 grid-row-8 border-2 gap-2 p-2 border-gray-200"
              >
                {currentArrangement?.arrangements?.length > 0 ? (
                  <>
                    {Array.from({ length: totalSeats }).map((_, index) => {
                      const student = currentArrangement.arrangements.find(
                        (s: any) => s.seatNumber === index
                      );

                      return student ? (
                        <StudentArrangementItem
                          key={student.studentId}
                          id={index + 1}
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
                          key={index}
                          onClick={() => handleSeatClick(index)}
                          className="seat w-full h-full p-5 bg-gray-200 border-[1px] border-[#eee] hover:border-[1px] hover:border-bgPink relative"
                        >
                          <label className="seat-number font-bold text-xs text-bgPurple absolute -top-4 left-4 hidden">
                            {index + 1}
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

          <SeatingHistory
            arrangements={arrangements}
            currentArrangement={currentArrangement}
            setCurrentArrangement={setCurrentArrangement}
            tenantPrimaryDomain={tenantPrimaryDomain}
            accessToken={accessToken}
            refreshToken={refreshToken}
            onReactivate={() => loadArrangements(selectedCourse || undefined)}
          />
        </div>
      </Card>
    </section>
  );
}
