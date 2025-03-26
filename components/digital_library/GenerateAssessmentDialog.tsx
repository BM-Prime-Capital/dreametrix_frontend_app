"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export function GenerateAssessmentDialog({ fileStream }: { fileStream: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          id="openFileModalButton"
          className="w-full bg-blue-500 hover:bg-blue-600 rounded-full invisible"
        >
          GENERATE
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <h4 className="font-bold text-center">Preview</h4>
        <div className="w-full h-[500px]">
          {fileStream ? (
            <embed
              src={fileStream}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          ) : (
            <div className="flex flex-col gap-8 justify-center items-center">
              <p className="text-muted-foreground">Loading PDF...</p>
              <p className="text-muted-foreground">
                Be sure that you filled all the field...
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-between gap-4 mt-4">
          <Link
            href={fileStream ? fileStream : "#"}
            target="_blank"
            className="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-md p-2 flex items-center justify-center"
          >
            Download
          </Link>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">
            Send to Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
