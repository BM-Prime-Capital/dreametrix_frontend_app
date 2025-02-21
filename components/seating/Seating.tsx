"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import PageTitleH2 from "../ui/page-title-h2";
import StudentArrangementItem from "./student-arrangement-item";
import { useState } from "react";
import StudentSeatingConditionsDialog from "./StudentSeatingConditionsDialog";

type StudentArrangement = {
  studentImageUrl: string;
  studentName: string;
  placeImageUrl?: string;
};

type StudentArrangementsWrapper = {
  id: number;
  title: string;
  arrangements: StudentArrangement[];
};

const studentArrangements: StudentArrangementsWrapper[] = [
  {
    id: 0,
    title: "12/07 Group Assignment2",
    arrangements: [
      {
        studentImageUrl: `${generalImages.student}`,
        studentName: "Patrick Jane",
        placeImageUrl: `${teacherImages.glass}`,
      },
      {
        studentImageUrl: `${generalImages.student}`,
        studentName: "Martin Bakole",
        placeImageUrl: undefined,
      },
      {
        studentImageUrl: `${generalImages.student2}`,
        studentName: "Clara Moore",
        placeImageUrl: `${teacherImages.seat_left}`,
      },
      {
        studentImageUrl: `${generalImages.student2}`,
        studentName: "Nanci Morgan",
        placeImageUrl: `${teacherImages.distracted}`,
      },
    ],
  },
  {
    id: 1,
    title: "11/07 Group Assignment1",
    arrangements: [
      {
        studentImageUrl: `${generalImages.student}`,
        studentName: "Patrick Jane",
        placeImageUrl: `${teacherImages.glass}`,
      },
      {
        studentImageUrl: `${generalImages.student}`,
        studentName: "Martin Bakole",
        placeImageUrl: undefined,
      },
      {
        studentImageUrl: `${generalImages.student2}`,
        studentName: "Clara Moore",
        placeImageUrl: `${teacherImages.seat_left}`,
      },
      {
        studentImageUrl: `${generalImages.student2}`,
        studentName: "Nanci Morgan",
        placeImageUrl: `${teacherImages.distracted}`,
      },
    ],
  },
  {
    id: 2,
    title: "10/07 Exam1",
    arrangements: [
      {
        studentImageUrl: `${generalImages.student2}`,
        studentName: "Lora Jane",
        placeImageUrl: `${teacherImages.glass}`,
      },
      {
        studentImageUrl: `${generalImages.student2}`,
        studentName: "Rose Moore",
        placeImageUrl: `${teacherImages.seat_right}`,
      },
      {
        studentImageUrl: `${generalImages.student}`,
        studentName: "Michel Ilunga",
        placeImageUrl: `${teacherImages.distracted}`,
      },
    ],
  },
  {
    id: 3,
    title: "09/07 Regular Calss",
    arrangements: [
      {
        studentImageUrl: `${generalImages.student}`,
        studentName: "Jordan Denver",
        placeImageUrl: `${teacherImages.seat_right}`,
      },
      {
        studentImageUrl: `${generalImages.student2}`,
        studentName: "Alicia Kitoko",
        placeImageUrl: `${teacherImages.distracted}`,
      },
    ],
  },
];

export default function Seating() {
  const [currentStudentArrangements, setCurrentStudentArrangements] =
    useState<StudentArrangementsWrapper>(studentArrangements[0]);

  const [isSeatingArrangementAuto, setIsSeatingArrangementAuto] =
    useState(true);

  const handleChangeSeatNumber = (
    currentSeatNumber: number,
    targetSeatNumber: number
  ) => {
    const currentArragements = currentStudentArrangements.arrangements;
    const currentSeatStudent = currentArragements[currentSeatNumber];
    const targetSeatStudent = currentArragements[targetSeatNumber];

    currentArragements[currentSeatNumber] = targetSeatStudent;
    currentArragements[targetSeatNumber] = currentSeatStudent;

    setCurrentStudentArrangements({
      ...currentStudentArrangements,
      arrangements: currentArragements,
    });
  };

  const handleSeatingArrangementAuto = () => {
    setIsSeatingArrangementAuto(true);
    setCurrentStudentArrangements({
      ...currentStudentArrangements,
      arrangements: shuffleArray(currentStudentArrangements.arrangements),
    });
  };

  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1)); // Get random index
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]]; // Swap elements
    }
    return array;
  }

  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="SEATING" />
        <div className="flex items-center gap-2">
          <select className="bg-white p-1 rounded-md">
            <option>Class 5 - Math</option>
            <option>Class 4 - Science</option>
            <option>Class 3 - Language</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => handleSeatingArrangementAuto()}
          className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md  px-2 py-4 lg:px-4 lg:py-6"
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
          className="flex gap-2 items-center text-lg bg-secondaryBtn hover:bg-[#cf4794] rounded-md  px-2 py-4 lg:px-4 lg:py-6"
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

        <Button className="flex gap-2 items-center text-lg bg-[#81B5E3] hover:bg-[#64a7e2] rounded-md  px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={generalImages.print}
            alt="add"
            width={100}
            height={100}
            className="w-8 h-8"
          />
        </Button>
      </div>
      <Card className="rounded-md">
        <div className="flex flex-wrap-reverse">
          <div className="flex flex-col gap-6 flex-1 py-4 px-8">
            <div className="flex flex-col pb-4 border-b-[1px] border-[#eee]">
              <PageTitleH2 title="ARRANGEMENT" />
              <label className="text-muted-foreground">BLACKBOARD</label>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {currentStudentArrangements.arrangements.length > 0 ? (
                <>
                  {currentStudentArrangements.arrangements.map(
                    (studentArrangement, index) => (
                      <StudentArrangementItem
                        key={index}
                        id={index + 1}
                        studentImageUrl={studentArrangement.studentImageUrl}
                        studentName={studentArrangement.studentName}
                        placeImageUrl={studentArrangement.placeImageUrl}
                        className={`order-${index}`}
                        changeSeatNumber={handleChangeSeatNumber}
                        maxSeatNumber={
                          currentStudentArrangements.arrangements.length
                        }
                        isSeatingArrangementAuto={isSeatingArrangementAuto}
                      />
                    )
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center">
                  <label className="text-muted-foreground">No data</label>
                </div>
              )}
            </div>
          </div>
          <div className="w-full sm:w-fit min-w-[200px] flex flex-col gap-6 bg-[#dfecf1] p-4 pb-0 sm:pb-4 pl-0">
            <PageTitleH2 title="HISTORY" className="pl-4" />
            <div className="flex sm:flex-col gap-4 pl-4 sm:pl-0 overflow-scroll">
              {studentArrangements.map((studentArrangement) => (
                <label
                  className={`text-[#55b4f1] whitespace-nowrap cursor-pointer ${
                    currentStudentArrangements.id === studentArrangement.id
                      ? "bg-white p-2 sm:py-2 sm:px-4 rounded-t-lg sm:rounded-r-full"
                      : "sm:pl-4"
                  }`}
                  onClick={() =>
                    setCurrentStudentArrangements(studentArrangement)
                  }
                >
                  {studentArrangement.title}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
