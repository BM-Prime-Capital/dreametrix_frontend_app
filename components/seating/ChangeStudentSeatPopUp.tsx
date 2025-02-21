"use client";

import { generalImages } from "@/constants/images";
import Image from "next/image";
import React, { useState } from "react";
import CrossCloseButton from "../ui/cross-close-button";

export default function ChangeStudentSeatPopUp({
  currentSeatNumber,
  changeSeatNumber,
  maxSeatNumber,
}: {
  currentSeatNumber: number;
  maxSeatNumber: number;
  changeSeatNumber: Function;
}) {
  const [open, setOpen] = useState(false);
  const [targetSeatNumber, setTargetSeatNumber] = useState<number>(1);

  const handleSeatNumberChange = () => {
    const correctCurrentSeatNumber = currentSeatNumber - 1;
    const targetSeatNumberMinusOne = targetSeatNumber - 1;
    const correctTargetSeatNumber =
      targetSeatNumberMinusOne < 0
        ? 0
        : targetSeatNumberMinusOne >= maxSeatNumber
        ? maxSeatNumber - 1
        : targetSeatNumberMinusOne;
    console.log({ correctCurrentSeatNumber, correctTargetSeatNumber });
    changeSeatNumber(correctCurrentSeatNumber, correctTargetSeatNumber);
    setOpen(false);
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex items-center gap-8">
        <button
          className="flex justify-center items-center bg-white p-1 rounded-md w-7 h-7"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <CrossCloseButton callBack={() => setOpen(false)} />
          ) : (
            <Image
              src={generalImages.seating}
              alt="seating"
              width={100}
              height={100}
              className="w-5 h-5"
            />
          )}
        </button>
      </div>
      {open ? (
        <div className="flex flex-col bg-white shadow-md rounded-md p-4 gap-4 w-fit absolute top-7 -left-1 z-10">
          <label className="flex flex-col justify-center items-center gap-2">
            <span className="text-muted-foreground">Enter seat number</span>
            <input
              type="number"
              className="px-2 py-1 border-[1px] border-[#eee] w-[160px] bg-white rounded-full"
              value={targetSeatNumber}
              onChange={(e) => setTargetSeatNumber(parseInt(e.target.value))}
              min={1}
              max={maxSeatNumber + 1} // array length + 1 for correct display
            />
          </label>
          <div className="flex justify-between gap-2">
            <button
              className="max-w-fit rounded-full px-4 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              onClick={() => handleSeatNumberChange()}
              className="max-w-fit bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
            >
              Apply
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
