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
import { Mic, Play, StopCircle, Check, Upload } from "lucide-react";

export function RecordDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Recording
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="p-8 bg-gray-100 rounded-lg flex items-center justify-center">
            {isRecording ? (
              <div className="flex items-center gap-2 text-red-500">
                <StopCircle className="h-6 w-6 animate-pulse" />
                <span>Recording in progress...</span>
              </div>
            ) : (
              <span className="text-gray-500">No recording yet</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant={isRecording ? "destructive" : "outline"} 
              className="flex-1 gap-2"
              onClick={() => setIsRecording(!isRecording)}
            >
              {isRecording ? (
                <>
                  <StopCircle className="h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start
                </>
              )}
            </Button>
            <Button variant="outline" className="flex-1 gap-2" disabled={!isRecording}>
              <Check className="h-4 w-4" />
              Review
            </Button>
            <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4" />
              Save
            </Button>
          </div>
          <audio controls className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}