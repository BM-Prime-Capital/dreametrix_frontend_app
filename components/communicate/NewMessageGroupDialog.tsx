"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import SelectedUsersPopUp from "../SelectedUsersPopUp";

export function NewMessageGroupDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex gap-2 items-center p-4 bg-white hover:bg-blue-100 rounded-md">
          <Image
            src={teacherImages.new_group}
            alt="new group"
            width={35}
            height={35}
          />
          <span className="text-[#28abe1] font-bold text-lg">New group</span>
        </button>
      </DialogTrigger>
      <DialogContent className="w-[300px]">
        <h2 className="pb-2 font-bold border-b-[1px] border-[#eee]">
          New Group
        </h2>
        <div className="flex flex-col gap-4 text-gray-600">
          <select className="p-2 bg-white rounded-full border-[1px] border-[#eee]">
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 3</option>
          </select>

          <SelectedUsersPopUp selectedUsers={[]} />
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
