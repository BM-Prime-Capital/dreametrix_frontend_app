"use client";

import { ISchoolClass } from "@/types";
import React, { useEffect, useState } from "react";

export default function ClassSelect({ className }: { className?: string }) {
  const loadedClasses = localStorage.getItem("classes");
  const loadedSelectedClass = localStorage.getItem("selectedClass");

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<ISchoolClass | null>(null);

  const handleClassChange = (value: string) => {
    const foundClass = classes.find((cl) => cl.name === value);
    localStorage.setItem("selectedClass", JSON.stringify(foundClass));
    setSelectedClass(foundClass);
  };

  useEffect(() => {
    if (loadedClasses) {
      const allClasses = JSON.parse(loadedClasses);
      setClasses(allClasses);
    }
  }, [loadedClasses]);

  useEffect(() => {
    if (loadedSelectedClass) {
      const selectedClass = JSON.parse(loadedSelectedClass);
      setSelectedClass(selectedClass);
    }
  }, [loadedSelectedClass]);

  return (
    <select
      value={selectedClass ? selectedClass.name : ""}
      onChange={(e) => handleClassChange(e.target.value)}
      className={`text-white bg-bgPurple font-bold p-1 rounded-md ${className}`}
    >
      <option value={""}>All Classes</option>
      {classes.map((classEl: any, index) => (
        <option key={index} value={classEl.name}>
          {classEl.name}
        </option>
      ))}
    </select>
  );
}
