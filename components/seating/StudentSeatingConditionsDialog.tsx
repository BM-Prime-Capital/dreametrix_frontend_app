"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { teacherImages } from "@/constants/images";
import Image from "next/image";

export default function StudentSeatingConditionsDialog({
  studentClassName,
}: {
  studentClassName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button className="flex gap-2 items-center text-lg bg-[#F5C358] hover:bg-[#eeb53b] rounded-md  px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={teacherImages.conditions}
            alt="conditions"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span>Conditions</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogHeader
          className="pb-4"
          style={{ borderBottom: "solid 1px #eee" }}
        >
          <DialogTitle className="flex gap-2 items-center opacity-80">
            <span>Class 5 - </span>
            <span className="text-muted-foreground">{"Math - Test 1"}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STUDENTS</TableHead>
                <TableHead>CONDITION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key={1}>
                <TableCell>
                  <div className="flex items-center gap-2 py-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <label className="text-gray-700">Martin Mobali</label>
                  </div>
                </TableCell>
                <TableCell>
                  <select className="bg-white p-2 rounded-full border-[1px] border-[#eee]">
                    <option>Use glasses</option>
                    <option>Seat on the left side</option>
                    <option>Seat on the right side</option>
                    <option>Get distracted</option>
                    <option>No Condition</option>
                  </select>
                </TableCell>
              </TableRow>
              <TableRow key={2} className={"bg-sky-50/50"}>
                <TableCell>
                  <div className="flex items-center gap-2 py-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <label className="text-gray-700">Bintu Keita</label>
                  </div>
                </TableCell>
                <TableCell>
                  <select className="bg-white p-2 rounded-full border-[1px] border-[#eee]">
                    <option>Use glasses</option>
                    <option>Seat on the left side</option>
                    <option>Seat on the right side</option>
                    <option>Get distracted</option>
                    <option>No Condition</option>
                  </select>
                </TableCell>
              </TableRow>
              <TableRow key={3} className={"bg-sky-50/50"}>
                <TableCell>
                  <div className="flex items-center gap-2 py-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <label className="text-gray-700">Clara Lorence</label>
                  </div>
                </TableCell>
                <TableCell>
                  <select className="bg-white p-2 rounded-full border-[1px] border-[#eee]">
                    <option>Use glasses</option>
                    <option>Seat on the left side</option>
                    <option>Seat on the right side</option>
                    <option>Get distracted</option>
                    <option>No Condition</option>
                  </select>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-center gap-4">
            <button
              className="max-w-fit rounded-full px-8 py-1 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="max-w-fit bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-1">
              Apply
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
