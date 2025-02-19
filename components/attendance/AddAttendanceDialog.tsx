"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, Users } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import TimeTableItem from "../ui/time-table-item";
import SelectedStudentsPopUp from "../SelectedStudentsPopUp";

export function AddAttendanceDialog() {
  const [open, setOpen] = useState(false);
  const [classDays, setClassDays] = useState<ClassDay[]>([
    { id: 1, day: "Monday", hour: "00", munite: "00", dayPart: "AM" },
  ]);

  const addNewClassDay = () => {
    const newId = classDays[classDays.length - 1].id + 1;
    setClassDays([
      ...classDays,
      { id: newId, day: "Monday", hour: "00", munite: "00", dayPart: "AM" },
    ]);
  };

  const handleClassDayChange = (
    classDayId: number,
    fieldName: "day" | "hour" | "munite" | "dayPart",
    newValue: string
  ) => {
    const newClassDays = classDays.map((classDay) => {
      if (classDay.id === classDayId) {
        classDay[fieldName] = newValue;
        return classDay;
      }
      return classDay;
    });
    setClassDays([...newClassDays]);
  };

  const handleDeleteClassDay = (id: number) => {
    const newClassDays = classDays.filter((classDay) => classDay.id != id);
    setClassDays([...newClassDays]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center text-lg bg-[#c586d1] hover:bg-[#A36EAD] rounded-md  px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={teacherImages.report}
            alt="report"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span>Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px]">
        <h2
          className="pb-2 font-bold"
          style={{ borderBottom: "solid 1px #eee;" }}
        >
          Report
        </h2>
        <div className="flex flex-col gap-2 text-gray-600">
          <select
            style={{ border: "solid 1px #eee" }}
            className="px-2 py-1 bg-white rounded-full"
          >
            <option>Class 5 - Math</option>
            <option>Class 6 - Math</option>
            <option>Class 7 - Math</option>
          </select>

          <SelectedStudentsPopUp selectedStudents={[]} />

          <div
            className="relative p-2 mt-2 rounded-md"
            style={{ border: "solid 1px #eee" }}
          >
            <label className="absolute -top-3 bg-white text-sm">
              Time-Frame
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">From: </span>
                <input
                  className="bg-white hover:bg-gray-50 rounded-md p-0.5 cursor-pointer"
                  type="date"
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">To: </span>
                <input
                  className="bg-white hover:bg-gray-50 rounded-md p-0.5 cursor-pointer"
                  type="date"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2">
            <Image
              src={teacherImages.save}
              height={100}
              width={100}
              className="h-6 w-6"
              alt="save"
            />
            <label>SAVE REPORT</label>
          </button>
          <button
            className="rounded-full px-4 py-2 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
