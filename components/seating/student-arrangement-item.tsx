import { generalImages, teacherImages } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";

export default function StudentArrangementItem({
  studentName,
  studentImageUrl,
  placeImageUrl,
  className,
  id,
  handleSeatClick,
  maxSeatNumber,
  isSeatingArrangementAuto,
}: {
  studentName: string;
  studentImageUrl: string;
  placeImageUrl?: string;
  className: string;
  id: number;
  handleSeatClick: Function;
  maxSeatNumber: number;
  isSeatingArrangementAuto: boolean;
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    handleSeatClick();
    setTimeout(() => {
      setIsClicked(false);
    }, 3000);
  };
  return (
    <div
      onClick={() => handleClick()}
      className={`flex justify-center items-center gap-2 bg-gray-100 p-2 w-full rounded-md hover:border-[1px] hover:border-bgPink relative ${
        isClicked ? "border-[1px] border-bgPink" : ""
      } ${className}`}
    >
      <label className="seat-number font-bold text-xs text-bgPurple absolute -top-4 left-4 hidden">
        {id}
      </label>

      <div className="flex flex-col gap-2 justify-center items-center">
        <Image src={studentImageUrl} alt="student" width={25} height={25} />
        <label className="text-xs">{studentName}</label>
      </div>

      <div className="absolute top-2 right-2">
        {placeImageUrl ? (
          <Image src={placeImageUrl} alt="student" width={10} height={10} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
