"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { generalImages } from "@/constants/images";

export function AddGradebookItemDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-base bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-white rounded-xl px-5 py-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group">

        <div className="relative flex items-center justify-center">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-7 h-7 transform group-hover:rotate-180 transition-transform duration-300"
          >
            <path 
              d="M12 5V19M5 12H19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 5V19M5 12H19" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="opacity-30"
            />
          </svg>
        </div>
        <span className="font-semibold tracking-wide">Add New Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            Add New Gradebook Entry
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4 py-4">
          <div className="flex-1 min-w-[200px] flex gap-1 flex-col">
            <label className="text-muted-foreground">Class:</label>
            <select className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option disabled selected>
                Select a Class
              </option>
              <option>Class 1</option>
              <option>Class 2</option>
              <option>Class 3</option>
              <option>Class 4</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px] flex gap-1 flex-col">
            <label className="text-muted-foreground">Assessment Type:</label>
            <select className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option disabled selected>
                Select Assignment Type
              </option>
              <option>Type 1</option>
              <option>Type 2</option>
              <option>Type 3</option>
              <option>Type 4</option>
            </select>{" "}
          </div>

          <div className="flex gap-1 flex-col w-full">
            <label className="text-muted-foreground">Class:</label>

            <label
              className="p-2 border-[1px] border-[#eee] rounded-md relative w-full flex justify-between"
              htmlFor="assignmentFile"
            >
              <input
                className="invisible absolute"
                type="file"
                id="assignmentFile"
              />
              <span className="font-bold text-muted-foreground">
                Choose a file
              </span>
              <span className="bg-blue-500 hover:bg-blue-700 text-white p-1 rounded-md">
                Browse
              </span>
            </label>
          </div>

          <label>
            Do you want to use DreaMetrix bank questions?{" "}
            <a className="text-blue-500 hover:text-blue-700" href="#">
              Go to the digital libray.
            </a>
          </label>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
            ADD TO THE GRADEBOOK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
