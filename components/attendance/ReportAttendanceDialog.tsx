"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import SelectedUsersPopUp from "../SelectedUsersPopUp";

interface ReportAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportAttendanceDialog({
  open,
  onOpenChange,
}: ReportAttendanceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <h2 className="pb-2 font-bold border-b border-gray-200">
          Attendance Report
        </h2>
        <div className="flex flex-col gap-4 text-gray-600">
          <select className="px-3 py-2 bg-white rounded-md border border-gray-200">
            <option>Class 5 - Math</option>
            <option>Class 6 - Math</option>
            <option>Class 7 - Math</option>
          </select>

          <SelectedUsersPopUp selectedUsers={[]} usersLabel="Students" />

          <div className="relative p-4 mt-2 rounded-md border border-gray-200">
            <label className="absolute -top-3 left-3 px-1 bg-white text-sm text-gray-500">
              Time Frame
            </label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">From:</span>
                <input
                  className="bg-white rounded-md p-2 border border-gray-200"
                  type="date"
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">To:</span>
                <input
                  className="bg-white rounded-md p-2 border border-gray-200"
                  type="date"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Button className="flex items-center justify-center gap-2">
            <Image
              src={teacherImages.save}
              height={24}
              width={24}
              alt="save"
            />
            <span>SAVE REPORT</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}