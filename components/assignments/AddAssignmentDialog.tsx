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
import { useState } from "react";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import { ClassDay } from "@/types";

export function AddAssignmentDialog() {
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
          <span>Add New Assignment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            ASSIGNMENT
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4 py-4">
          <div className="flex-1 min-w-[200px]">
            <select className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option disabled selected>
                Class
              </option>
              <option>Class 1</option>
              <option>Class 2</option>
              <option>Class 3</option>
              <option>Class 4</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input className="rounded-full" placeholder="Subjet" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <select className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option disabled selected>
                Grade
              </option>
              <option>Grade 1</option>
              <option>Grade 2</option>
              <option>Grade 3</option>
              <option>Grade 4</option>
            </select>{" "}
          </div>
          <div className="flex-1 min-w-[200px]">
            <select className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option disabled selected>
                Status
              </option>
              <option>Open</option>
              <option>Pending</option>
              <option>Canceled</option>
              <option>Closed</option>
            </select>{" "}
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input type="file" className="rounded-full" placeholder="File" />
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
