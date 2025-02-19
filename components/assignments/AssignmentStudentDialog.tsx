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
import PageTitleH2 from "../ui/page-title-h2";
import Link from "next/link";

export default function AssignmentStudentDialog({
  studentClassName,
}: {
  studentClassName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Image src={teacherImages.files} alt="files" width={25} height={25} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[90%]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <PageTitleH2 title="Prince Bakenga" />
            <span className="text-muted-foreground">Assignment 2</span>
          </div>

          <iframe src="/assets/google_search.pdf" className="h-full"></iframe>

          <div>
            <audio controls>
              <source src="audio-file.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className="flex gap-2">
            <Link
              className="flex justify-center items-center w-full bg-gray-100 hover:bg-gray-200  rounded-full"
              href="/assets/google_search.pdf"
              target="_blank"
            >
              Open in tap
            </Link>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 rounded-full">
              Record Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
