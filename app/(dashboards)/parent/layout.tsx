"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { ParentSidebar } from "@/components/parents/ParentSidebar"
import { ParentRoutes } from "@/constants/routes"
import { SidebarProvider } from "@/lib/SidebarContext"
import { LoadingProvider } from "@/lib/LoadingContext"

function ParentDashboardContent({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <SidebarProvider>
        <Card className="w-full lg:w-[200px] h-fit">
          <ParentSidebar routes={ParentRoutes} />
        </Card>
      </SidebarProvider>
      {children}
    </div>
  )
}

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LoadingProvider>
      <ParentDashboardContent>
        {children}
      </ParentDashboardContent>
    </LoadingProvider>
  )
}
