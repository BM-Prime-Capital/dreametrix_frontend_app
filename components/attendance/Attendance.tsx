"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { AttendanceTable } from "./attendance-table";
import { ReportAttendanceDialog } from "./ReportAttendanceDialog";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

export default function Attendance() {
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [isAttendanceDatePast, setIsAttendanceDatePast] = useState(false);

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (new Date(attendanceDate) < new Date(currentDate)) {
      setIsAttendanceDatePast(true);
    } else {
      setIsAttendanceDatePast(false);
    }
  }, [attendanceDate]);

  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="ATTENDANCE" />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <span>Day: </span>
            <input
              className="bg-white hover:bg-gray-50 rounded-md p-0.5 cursor-pointer"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </label>

          <select className="bg-white hover:bg-gray-50 p-1 rounded-md cursor-pointer">
            <option>Class 5 - Math</option>
            <option>Class 4 - Science</option>
            <option>Class 3 - Language</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4 justify-start">
        <ReportAttendanceDialog />
        <Link
          target="_blank"
          href={"/assets/google_search.pdf"}
          className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md px-4"
        >
          <Image
            src={teacherImages.print}
            alt="print"
            width={100}
            height={100}
            className="w-8 h-8"
          />
        </Link>
        {isAttendanceDatePast ? (
          <Button
            variant="ghost"
            size="icon"
            className="flex h-full bg-white rounded-md border-[1px] border-[#ddd] hover:bg-blue-50"
            title="Modify All"
            onClick={() => setIsAttendanceDatePast(false)}
          >
            <Pencil className="text-[#25AAE1]" />
          </Button>
        ) : (
          ""
        )}

        {!isAttendanceDatePast ? (
          <Button className="flex gap-2 items-center text-lg bg-green-500 hover:bg-green-700 rounded-md  px-2 py-4 lg:px-4 lg:py-6">
            <Image
              src={teacherImages.save}
              alt="report"
              width={100}
              height={100}
              className="w-8 h-8"
            />
            <span>Save</span>
          </Button>
        ) : (
          ""
        )}
      </div>
      <Card className="rounded-md">
        <AttendanceTable isAttendanceDatePast={isAttendanceDatePast} />
      </Card>
    </section>
  );
}
