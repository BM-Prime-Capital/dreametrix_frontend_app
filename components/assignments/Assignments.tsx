import { Card } from "@/components/ui/card";
import { AssignmentsTable } from "./assignments-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generalImages } from "@/constants/images";

export default function Assignments() {
  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="ASSIGNMENTS" />
        <div className="flex items-center gap-2">
          <select className="px-2 py-1 border rounded-md text-sm">
            <option>All Assignments</option>
            <option>Grade 5</option>
            <option>Grade 6</option>
            <option>Grade 7</option>
          </select>
        </div>
      </div>
      <div>
        <Button className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md  px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={generalImages.add}
            alt="add"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span>Add New Assignment</span>
        </Button>
      </div>
      <Card className="rounded-md">
        <AssignmentsTable />
      </Card>
    </section>
  );
}
