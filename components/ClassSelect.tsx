"use client";

import { updateSelectedClass } from "@/redux/slices/generalInfoReducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ClassSelect() {
  const { selectedClass } = useSelector((state: any) => state.generalInfo);
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
      <option value={"All Classes"}>All Classes</option>
      <option value={"Class 5 - Math"}>Class 5 - Math</option>
      <option value={"Class 4 - Science"}>Class 4 - Science</option>
      <option value={"Class 3 - Language"}>Class 3 - Language</option>
    </select>
  );
}
