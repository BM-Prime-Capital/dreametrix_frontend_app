"use client"

import { Card } from "@/components/ui/card"
import { ClassesTable } from "./classes-table"
import AllClassFiltersPopUp from "./AllClassFiltersPopUp"
import { AddClassDialog } from "./AddClassDialog"

export default function ClassesPage() {
  return (
    <section className="flex flex-col gap-4 w-full p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-normal text-[#25AAE1]">CLASSES</h1>
        <div className="flex gap-2">
          <AllClassFiltersPopUp />
          <AddClassDialog />
        </div>
      </div>
      <Card className="rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <ClassesTable />
      </Card>
    </section>
  )
}

