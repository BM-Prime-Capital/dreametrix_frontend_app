'use client'
import { Card } from "@/components/ui/card";
import { ClassesTable } from "./classes-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import AllClassFiltersPopUp from "./AllClassFiltersPopUp";
import { AddClassDialog } from "./AddClassDialog";

export default function ClassesPage() {
  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="CLASSES" />
        <AllClassFiltersPopUp />
      </div>
      <div>
        <AddClassDialog />
      </div>
      <Card className="rounded-md">
        <ClassesTable />
      </Card>
    </section>
  );
}
