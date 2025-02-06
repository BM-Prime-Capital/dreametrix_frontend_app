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

export default function ContactParentModal({
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
          className="h-4 w-4"
          title="info"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader
          className="pb-4"
          style={{ borderBottom: "solid 1px #eee" }}
        >
          <DialogTitle className="opacity-80">Contact their Parent</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p>
            <h2 className="opacity-75">{childrenName}</h2>
            <label className="text-muted-foreground">
              is having issues with her submissions, she's not completing her
              homework assignments
            </label>
          </p>
          <p className="flex justify-between">
            <button>Ok</button>
            <button className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-white">
              CONTACT
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
