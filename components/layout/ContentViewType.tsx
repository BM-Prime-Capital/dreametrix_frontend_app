"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { ISchoolClass } from "@/types";

export default function ContentViewType({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadedSelectedClass = localStorage.getItem("selectedClass");
  const [selectedClass, setSelectedClass] = useState<ISchoolClass | null>(null);

  const handleGeneralViewSelection = () => {
    localStorage.removeItem("selectedClass");
    setSelectedClass(null);
    setSelectedView("1");
    window.location.reload();
  };

  useEffect(() => {
    if (loadedSelectedClass) {
      const selectedClass = JSON.parse(loadedSelectedClass);
      setSelectedClass(selectedClass);
      setSelectedView("2");
    }
  }, [loadedSelectedClass]);

  const [selectedView, setSelectedView] = useState<string>("1");

  return (
    <div
      className={`font-bold flex flex-wrap justify-between items-center rounded-t-lg border-t-[4px] ${
        !selectedClass ? "border-blue-500" : "border-bgPurple"
      }`}
    >
      <div className="flex items-center">{children}</div>
      <select
        className={`${
          !selectedClass ? "bg-blue-500" : "bg-bgPurple"
        } text-white p-2 rounded-tr-md`}
        value={selectedView}
        onChange={(e) => setSelectedView(e.target.value)}
      >
        <option value={"1"} onClick={() => handleGeneralViewSelection()}>
          GENERAL VIEW
        </option>
        <SelectCurrentClassDialog setSelectedView={setSelectedView} />
      </select>
    </div>
  );
}

function SelectCurrentClassDialog({
  setSelectedView,
}: {
  setSelectedView: Function;
}) {
  const loadedSelectedClass = localStorage.getItem("selectedClass");
  const loadedClasses = localStorage.getItem("classes");

  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<ISchoolClass | null>(null);

  console.log("TESTA => ", { loadedSelectedClass, selectedClass });

  const handleClassChange = (value: string) => {
    const foundClass = classes.find((cl) => cl.name === value);
    localStorage.setItem("selectedClass", JSON.stringify(foundClass));
    setSelectedClass(foundClass);
    setSelectedView("2");
    setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <option value={"2"} className="flex items-center">
          FOCUSED VIEW {selectedClass ? ": " + selectedClass.name : ""}
        </option>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            CHOOSE CLASS
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <label className="text-muted-foreground">
            On which Class do you want to focus ?
          </label>
          <select
            value={selectedClass?.name}
            onChange={(e) => handleClassChange(e.target.value)}
            className={`text-white bg-bgPurple font-bold p-4 rounded-md text-2xl`}
          >
            {classes.map((classEl: any, index: number) => (
              <option key={index} value={classEl.name}>
                {classEl.name}
              </option>
            ))}
          </select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
