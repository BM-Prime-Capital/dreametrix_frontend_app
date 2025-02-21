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
import { generalImages } from "@/constants/images";
import TimeTableItem from "../ui/time-table-item";
import SelectedStudentsPopUp from "../SelectedStudentsPopUp";
import { ClassDay } from "@/types";

export function AddClassDialog() {
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
        <Button className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md  px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={generalImages.add}
            alt="add"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span>Add New Class</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            CLASS
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4 py-4">
          <div className="flex-1 min-w-[200px]">
            <Input className="rounded-full" placeholder="Class" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input className="rounded-full" placeholder="Subjet" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input className="rounded-full" placeholder="Grade" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <SelectedStudentsPopUp selectedStudents={[]} />
          </div>
          <div
            className="flex flex-col flex-1 min-w-[200px] p-4 gap-2 relative rounded-md"
            style={{ border: "solid 1px #eee" }}
          >
            <label className="text-gray-500 absolute -top-3.5 bg-white">
              Class Days
            </label>
            {classDays.map((classDay: ClassDay) => (
              <TimeTableItem
                key={classDay.id}
                id={classDay.id}
                day={classDay.day}
                hour={classDay.hour}
                munite={classDay.munite}
                dayPart={classDay.dayPart}
                handleTimeTableItemChangeCallback={handleClassDayChange}
                handleDeleteCallback={handleDeleteClassDay}
              />
            ))}

            <button
              className="max-w-fit mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
              onClick={() => addNewClassDay()}
            >
              Add new Day
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            APPLY
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
