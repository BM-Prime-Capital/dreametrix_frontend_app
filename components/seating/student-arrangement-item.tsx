import { generalImages, teacherImages } from "@/constants/images";
import Image from "next/image";
import React from "react";
import ChangeStudentSeatPopUp from "./ChangeStudentSeatPopUp";

export default function StudentArrangementItem({
  studentName,
  studentImageUrl,
  placeImageUrl,
  className,
  id,
  changeSeatNumber,
  maxSeatNumber,
  isSeatingArrangementAuto,
}: {
  studentName: string;
  studentImageUrl: string;
  placeImageUrl?: string;
  className: string;
  id: number;
  changeSeatNumber: Function;
  maxSeatNumber: number;
  isSeatingArrangementAuto: boolean;
}) {
  return (
    <div
      className={`flex justify-center items-center gap-2 bg-gray-100 p-2 w-[200px] rounded-md relative ${className}`}
    >
      {!isSeatingArrangementAuto ? (
        <>
          <label className="font-bold text-red-500 absolute -top-4 left-4">
            {id}
          </label>
          <div className="absolute top-2 left-2">
            <ChangeStudentSeatPopUp
              currentSeatNumber={id}
              changeSeatNumber={changeSeatNumber}
              maxSeatNumber={maxSeatNumber}
            />
          </div>
        </>
      ) : (
        ""
      )}

      <div className="flex flex-col gap-2 justify-center items-center">
        <Image src={studentImageUrl} alt="student" width={70} height={70} />
        <label>{studentName}</label>
      </div>

      <div className="absolute top-2 right-2">
        {placeImageUrl ? (
          <Image src={placeImageUrl} alt="student" width={30} height={30} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
