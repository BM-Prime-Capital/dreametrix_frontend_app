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
import { generalImages, teacherImages } from "@/constants/images";

export function RecordDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Image
          src={teacherImages.voice_note}
          alt="add"
          width={100}
          height={100}
          className="w-5 h-5 cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            Voice Recording
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="p-8 bg-gray-100"></div>
          <div className="flex gap-2">
            <Button className="bg-red-500 hover:bg-red-600 text-white w-full">
              Start
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white w-full">
              Review
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
              Save
            </Button>
          </div>
          <audio controls />
        </div>
      </DialogContent>
    </Dialog>
  );
}
