"use client";

import { initialClasses } from "@/constants/global";
import { updateSelectedClass } from "@/redux/slices/generalInfoReducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ClassSelect() {
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
      className="text-white bg-bgPurple font-bold p-1 rounded-md"
    >
      {initialClasses.map((classEl: any) => (
        <option value={classEl.name}>{classEl.name}</option>
      ))}
    </select>
  );
}
