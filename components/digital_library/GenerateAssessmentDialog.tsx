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

export function GenerateAssessmentDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 hover:bg-blue-600 rounded-full">
          GENERATE
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <h4 className="font-bold text-center">Preview</h4>
        <div className="flex justify-between gap-4 mt-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
            Download
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
            Send to Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
