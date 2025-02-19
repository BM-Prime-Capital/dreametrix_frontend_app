import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { AttendanceTable } from "./attendance-table";
import { AddAttendanceDialog } from "./AddAttendanceDialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import Link from "next/link";

export default function Attendance() {
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
        <AddAttendanceDialog />
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
      </div>
      <Card className="rounded-md">
        <AttendanceTable />
      </Card>
    </section>
  );
}
