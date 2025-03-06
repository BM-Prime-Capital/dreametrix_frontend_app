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
import ClassSelect from "../ClassSelect";
import { Key } from "lucide-react";

type StudentArrangement = {
  seatNumber: number;
  studentImageUrl: string;
  studentName: string;
  placeImageUrl?: string;
};

type StudentArrangementsWrapper = {
  id: number;
  title: string;
  arrangements: StudentArrangement[];
};

const totalCells = 144;

export default function Seating() {
  const [studentArrangements, setStudentArrangements] = useState<
    StudentArrangementsWrapper[]
  >([
    {
      id: 0,
      title: "12/07 Group Assignment2",
      arrangements: [
        {
          seatNumber: 1,
          studentImageUrl: `${generalImages.student}`,
          studentName: "Patrick Jane",
          placeImageUrl: `${teacherImages.glass}`,
        },
        {
          seatNumber: 12,
          studentImageUrl: `${generalImages.student}`,
          studentName: "Martin Bakole",
          placeImageUrl: undefined,
        },
        {
          seatNumber: 14,
          studentImageUrl: `${generalImages.student2}`,
          studentName: "Clara Moore",
          placeImageUrl: `${teacherImages.seat_left}`,
        },
        {
          seatNumber: 25,
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
          seatNumber: 0,
          studentImageUrl: `${generalImages.student}`,
          studentName: "Patrick Jane",
          placeImageUrl: `${teacherImages.glass}`,
        },
        {
          seatNumber: 1,
          studentImageUrl: `${generalImages.student}`,
          studentName: "Martin Bakole",
          placeImageUrl: undefined,
        },
        {
          seatNumber: 2,
          studentImageUrl: `${generalImages.student2}`,
          studentName: "Clara Moore",
          placeImageUrl: `${teacherImages.seat_left}`,
        },
        {
          seatNumber: 3,
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
          seatNumber: 0,
          studentImageUrl: `${generalImages.student2}`,
          studentName: "Lora Jane",
          placeImageUrl: `${teacherImages.glass}`,
        },
        {
          seatNumber: 1,
          studentImageUrl: `${generalImages.student2}`,
          studentName: "Rose Moore",
          placeImageUrl: `${teacherImages.seat_right}`,
        },
        {
          seatNumber: 2,
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
          seatNumber: 0,
          studentImageUrl: `${generalImages.student}`,
          studentName: "Jordan Denver",
          placeImageUrl: `${teacherImages.seat_right}`,
        },
        {
          seatNumber: 1,
          studentImageUrl: `${generalImages.student2}`,
          studentName: "Alicia Kitoko",
          placeImageUrl: `${teacherImages.distracted}`,
        },
      ],
    },
  ]);

  const [currentStudentArrangements, setCurrentStudentArrangements] =
    useState<StudentArrangementsWrapper>(studentArrangements[0]);

  const [firstSelectedSeatNumber, setFirstSelectedSeatNumber] =
    useState<number>(-1);
  const [isSeatingArrangementAuto, setIsSeatingArrangementAuto] =
    useState(true);

  const handleSeatClick = (targetSeatNumber: number) => {
    setFirstSelectedSeatNumber((prevSelectedseatNumber) => {
      if (prevSelectedseatNumber === -1) {
        return targetSeatNumber; // Set the first selected seat
      } else {
        // Perform the swap operation
        const newArrangements = currentStudentArrangements.arrangements.map(
          (studentArrangement) => {
            if (studentArrangement.seatNumber === prevSelectedseatNumber) {
              return { ...studentArrangement, seatNumber: targetSeatNumber };
            } else if (studentArrangement.seatNumber === targetSeatNumber) {
              return {
                ...studentArrangement,
                seatNumber: prevSelectedseatNumber,
              };
            } else {
              return studentArrangement;
            }
          }
        );

        const newCurrentArrangement = {
          ...currentStudentArrangements,
          arrangements: newArrangements,
        };
        setCurrentStudentArrangements(newCurrentArrangement);
        setStudentArrangements(
          studentArrangements.map((arr) => {
            if (arr.id === currentStudentArrangements.id) {
              return newCurrentArrangement;
            }
            return arr;
          })
        );
        return -1; // Reset selection after swapping
      }
    });
  };

  const ARRANGEMENT_INITIAL_STATE = Array.from(
    { length: totalCells },
    (_, i) => (
      <div
        key={i}
        onClick={() => handleSeatClick(i)}
        className="seat w-full h-full p-5 bg-gray-200 border-[1px] border-[#eee] hover:border-[1px] hover:border-bgPink relative "
      >
        <label className="seat-number font-bold text-xs text-bgPurple absolute -top-4 left-4 hidden">
          {i + 1}
        </label>
      </div>
    )
  );

  const [arrangementGrid, setArrangementGrid] = useState<any[]>(
    ARRANGEMENT_INITIAL_STATE
  );

  const handleSeatingArrangementAuto = () => {
    setIsSeatingArrangementAuto(true);
    const shuffleArrayData = assignRandomSeatNumbers(
      currentStudentArrangements.arrangements
    );

    const newCurrenSeatingArrangement = {
      ...currentStudentArrangements,
      arrangements: shuffleArrayData,
    };
    console.log(
      "newCurrenSeatingArrangement NOW => ",
      newCurrenSeatingArrangement
    );
    setCurrentStudentArrangements((prev) => newCurrenSeatingArrangement);
  };

  useEffect(() => {
    const updatedArrangementGrid = [...ARRANGEMENT_INITIAL_STATE];
    currentStudentArrangements.arrangements.map((studentArrangement, index) => {
      console.log("studentArrangement NOW => ", studentArrangement);
      const seatNumber = studentArrangement.seatNumber;
      updatedArrangementGrid[seatNumber] = (
        <StudentArrangementItem
          key={seatNumber}
          id={seatNumber + 1}
          studentImageUrl={studentArrangement.studentImageUrl}
          studentName={studentArrangement.studentName}
          placeImageUrl={studentArrangement.placeImageUrl}
          className={`order-${index}`}
          handleSeatClick={() => handleSeatClick(seatNumber)}
          maxSeatNumber={currentStudentArrangements.arrangements.length}
          isSeatingArrangementAuto={isSeatingArrangementAuto}
        />
      );
    });

    setArrangementGrid([...updatedArrangementGrid]);
  }, [currentStudentArrangements]);

  useEffect(() => {
    const seatNumbers = Array.from(
      document.getElementsByClassName("seat-number")
    );
    if (!isSeatingArrangementAuto) {
      for (const seatNumber of seatNumbers) {
        seatNumber.classList.remove("hidden");
      }
    } else {
      for (const seatNumber of seatNumbers) {
        seatNumber.classList.add("hidden");
      }
    }
  }, [isSeatingArrangementAuto]);

  function assignRandomSeatNumbers(seats: any[]): any[] {
    if (seats.length > 134) {
      throw new Error("Cannot assign unique seat numbers. Too many seats!");
    }

    // Generate an array of unique seat numbers from 0 to 133
    const availableNumbers = Array.from({ length: 144 }, (_, i) => i);

    // Shuffle the seat numbers
    for (let i = availableNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableNumbers[i], availableNumbers[j]] = [
        availableNumbers[j],
        availableNumbers[i],
      ];
    }

    // Assign shuffled numbers to the seats
    return seats.map((seat, index) => ({
      ...seat,
      seatNumber: availableNumbers[index], // Get a unique number from shuffled array
    }));
  }

  /*   function shuffleArray(toShuffleArray: any[]) {

    let shuffledArray: any[] = [];

    if (toShuffleArray.length < 1) {
      return toShuffleArray;
    } else {
      for (let i = 0; i < toShuffleArray.length; i++) {
        let shuffleIsFinished = false;

        while (!shuffleIsFinished) {
          const randomNumber = Math.floor(Math.random() * 144);
          
        }
      }
      return shuffledArray;
    }
    
  } */

  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="SEATING" />
        <div className="flex items-center gap-2">
          <ClassSelect />
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
            <div
              id="arrangementGrid"
              className="grid grid-cols-12 grid-row-12 border-2 gap-2 p-2 border-gray-200"
            >
              {currentStudentArrangements.arrangements.length > 0 ? (
                <>
                  {arrangementGrid.map((item: any, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </>
              ) : (
                <div className="flex items-center justify-center">
                  <label className="text-muted-foreground">No Students</label>
                </div>
              )}
            </div>
          </div>
          <div className="w-full sm:w-fit min-w-[200px] flex flex-col gap-6 bg-[#dfecf1] p-4 pb-0 sm:pb-4 pl-0">
            <PageTitleH2 title="HISTORY" className="pl-4" />
            <div className="flex sm:flex-col gap-4 pl-4 sm:pl-0 overflow-scroll">
              {studentArrangements.map((studentArrangement, index) => (
                <label
                  key={index}
                  className={`text-[#55b4f1] whitespace-nowrap cursor-pointer p-2 sm:p-0 ${
                    currentStudentArrangements.id === studentArrangement.id
                      ? "bg-white sm:py-2 sm:px-4 rounded-t-lg sm:rounded-r-full"
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
