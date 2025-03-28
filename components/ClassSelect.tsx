"use client";

import { initialClasses } from "@/constants/global";
import { updateSelectedClass } from "@/redux/slices/generalInfoReducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ClassSelect({ className }: { className?: string }) {
  const { selectedClass, allClasses } = useSelector(
    (state: any) => state.generalInfo
  );
  const dispatch = useDispatch();

  const handleClassChange = (newSelectedCalss: string) => {
    dispatch(updateSelectedClass(newSelectedCalss));
  };

  return (
    <select
      value={selectedClass}
      onChange={(e) => handleClassChange(e.target.value)}
      className={`text-white bg-bgPurple font-bold p-1 rounded-md ${className}`}
    >
      {initialClasses.map((classEl: any, index) => (
        <option key={index} value={classEl.name}>
          {classEl.name}
        </option>
      ))}
    </select>
  );
}
