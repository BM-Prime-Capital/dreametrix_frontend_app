"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { ParentSidebar } from "@/components/parents/ParentSidebar"
import { ParentRoutes } from "@/constants/routes"

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card className="w-full lg:w-[200px] h-fit">
        <ParentSidebar routes={ParentRoutes} />
      </Card>
      {children}
    </div>
  )
}
