//import { generalImages, teacherImages } from "@/constants/images";
import Image from "next/image";
import React from "react";

export default function StudentArrangementItem({
  studentName,
  studentImageUrl,
  className,
  id,
  handleSeatClick,
 // maxSeatNumber,
  isSeatingArrangementAuto,
  isSelected,
}: {
  studentName: string;
  studentImageUrl: string;
  className: string;
  id: number;
  handleSeatClick: () => void;
  maxSeatNumber: number;
  isSeatingArrangementAuto: boolean;
  isSelected: boolean;
}) {
  return (
    <div
      onClick={handleSeatClick}
      className={`flex justify-center items-center gap-2 py-2 px-1  w-full rounded-md hover:border-[1px] hover:border-bgPink relative ${
        isSelected
          ? "border-2 border-blue-500 bg-blue-50"
          : "bg-gray-100 border-[1px] border-[#eee]"
      } ${className}`}
    >
      {!isSeatingArrangementAuto && (
        <label className="seat-number font-bold text-xs text-bgPurple absolute -top-4 left-4">
          {id}
        </label>
      )}

      <div className="flex flex-col gap-2 justify-center items-center w-full">
        <Image 
          src={studentImageUrl} 
          alt="student" 
          width={25} 
          height={25} 
          className="rounded-full"
        />
        <label className="text-[10px] truncate max-w-full px-0">
          {studentName}
        </label>
      </div>
    </div>
  );
}