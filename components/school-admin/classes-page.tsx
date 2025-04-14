"use client"

import { Card } from "@/components/ui/card"
import { ClassesTable } from "./classes-table"
import AllClassFiltersPopUp from "../classes/AllClassFiltersPopUp"
import { AddClassDialog } from "./add-class-dialog"
import { useState } from "react"
import PageTitleH1 from "../ui/page-title-h1"

export default function ClassesPage() {
  const [refreshTime, setRefreshTime] = useState<string>("")
  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <PageTitleH1 title="CLASSES" />
        <AllClassFiltersPopUp />
      </div>

      <div>
        <AddClassDialog setRefreshTime={setRefreshTime} />
      </div>
      <Card className="rounded-lg shadow-sm">
        <ClassesTable refreshTime={refreshTime} />
      </Card>
    </section>
  )
}

