"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClassStudent from "./AssignmentStudent";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { teacherImages } from "@/constants/images";
import Image from "next/image";

export default function AssignmentStudentsDialog({
  studentClassName,
}: {
  studentClassName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4 text-sky-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader
          className="pb-4"
          style={{ borderBottom: "solid 1px #eee" }}
        >
          <DialogTitle className="flex gap-2 items-center opacity-80">
            <span>Class 5 - </span>
            <span className="text-muted-foreground">{"Math - Test 1"}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <table>
            <thead className="pb-4" style={{ borderBottom: "solid 1px #eee" }}>
              <tr className="text-left">
                <th>STUDENTS</th>
                <th>AI SCORE</th>
                <th>YOUR SCORE</th>
                <th>FEEDBACK</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "solid 1px #eee" }}>
                <td>
                  <div className="flex items-center gap-2 py-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <label className="text-gray-700">Student name</label>
                    <Image
                      src={teacherImages.files}
                      alt="files"
                      width={25}
                      height={25}
                    />
                  </div>
                </td>
                <td>48</td>
                <td>
                  <div className="flex gap-2 items-center">
                    <span>25</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-sky-500" />
                    </Button>
                  </div>
                </td>
                <td>
                  <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground">03</span>
                    <Image
                      src={teacherImages.feedback}
                      alt="feedback"
                      width={25}
                      height={25}
                    />
                  </div>
                </td>
              </tr>
              <tr style={{ borderBottom: "solid 1px #eee" }}>
                <td>
                  <div className="flex items-center gap-2 py-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <label className="text-gray-700">Student name</label>
                    <Image
                      src={teacherImages.files}
                      alt="files"
                      width={25}
                      height={25}
                    />
                  </div>
                </td>
                <td>48</td>
                <td>
                  <div className="flex gap-2 items-center">
                    <span>25</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-sky-500" />
                    </Button>
                  </div>
                </td>
                <td>
                  <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground">03</span>
                    <Image
                      src={teacherImages.feedback}
                      alt="feedback"
                      width={25}
                      height={25}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
