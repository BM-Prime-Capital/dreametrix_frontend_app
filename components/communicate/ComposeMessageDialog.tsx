"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import SelectedStudentsPopUp from "../SelectedStudentsPopUp";

export function ComposeMessageDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md  px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={teacherImages.compose}
            alt="report"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span>Compose</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit]">
        <h2
          className="pb-2 font-bold"
          style={{ borderBottom: "solid 1px #eee;" }}
        >
          Compose
        </h2>
        <div className="flex flex-col gap-2 text-gray-600">
          <input
            type="text"
            style={{ border: "solid 1px #eee" }}
            className="px-2 py-1 bg-white rounded-full"
            placeholder="To.."
          />

          <input
            type="file"
            style={{ border: "solid 1px #eee" }}
            className="px-2 py-1 bg-white rounded-full"
          />

          <textarea
            className="w-full px-2 py-1 bg-white rounded-lg border-[1px] border-[#eee]"
            rows={3}
            placeholder="Message..."
          />
        </div>
        <div className="flex justify-between gap-2">
          <button
            className="rounded-full px-4 py-2 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button className="flex p-2 px-8 items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
            SEND
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
