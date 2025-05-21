"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import { Button } from "../ui/button";

export default function ContactParentDialog({
  childrenName,
}: {
  childrenName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Image
          src={teacherImages.information}
          alt="info"
          width={100}
          height={100}
          className="h-5 w-5 opacity-70 hover:opacity-100 transition-opacity"
          title="Contact parent"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-lg">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-gray-700 font-semibold">
            Contact Parent
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div>
            <h2 className="text-lg font-medium text-gray-800">{childrenName}</h2>
            <p className="text-gray-600 mt-1">
              is having issues with homework completion and submissions.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="px-6 rounded-full"
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 px-6 rounded-full">
              CONTACT
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}