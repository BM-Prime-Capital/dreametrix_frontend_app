'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassDay {
  id: number;
  day: string;
  hour: string;
  minute: string;
  dayPart: string;
}

export function AddClassDialog() {
  const [open, setOpen] = useState(false);
  const [classDays, setClassDays] = useState<ClassDay[]>([
    { id: 1, day: "Monday", hour: "00", minute: "00", dayPart: "AM" },
  ]);

  const addNewClassDay = () => {
    const newId = classDays[classDays.length - 1].id + 1;
    setClassDays([
      ...classDays,
      { id: newId, day: "Monday", hour: "00", minute: "00", dayPart: "AM" },
    ]);
  };

  const handleClassDayChange = (
    classDayId: number,
    fieldName: keyof ClassDay,
    newValue: string
  ) => {
    setClassDays(classDays.map(day => 
      day.id === classDayId ? { ...day, [fieldName]: newValue } : day
    ));
  };

  const handleDeleteClassDay = (id: number) => {
    setClassDays(classDays.filter(day => day.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-base bg-blue-500 hover:bg-blue-600">
          <Plus className="h-5 w-5" />
          Add New Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            Add New Class
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Input className="rounded-lg" placeholder="Class Name" />
          <Input className="rounded-lg" placeholder="Subject" />
          <Input className="rounded-lg" placeholder="Grade" />
          <Input className="rounded-lg" placeholder="Teacher" />
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <label className="text-sm font-medium text-gray-700">Class Days</label>
          
          {classDays.map((day) => (
            <div key={day.id} className="grid grid-cols-4 gap-2">
              <Select
                value={day.day}
                onValueChange={(value) => handleClassDayChange(day.id, "day", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                min="1"
                max="12"
                value={day.hour}
                onChange={(e) => handleClassDayChange(day.id, "hour", e.target.value)}
                className="w-full"
                placeholder="Hour"
              />

              <Input
                type="number"
                min="0"
                max="59"
                value={day.minute}
                onChange={(e) => handleClassDayChange(day.id, "minute", e.target.value)}
                className="w-full"
                placeholder="Minute"
              />

              <Select
                value={day.dayPart}
                onValueChange={(value) => handleClassDayChange(day.id, "dayPart", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>

              {classDays.length > 1 && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteClassDay(day.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addNewClassDay}
            className="w-full mt-2"
          >
            Add Another Day
          </Button>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600">
            Create Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}