"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { ParentSidebar } from "@/components/parents/ParentSidebar"
import { ParentRoutes } from "@/constants/routes"
import { SidebarProvider } from "@/lib/SidebarContext"
import { LoadingProvider, useLoading } from "@/lib/LoadingContext"
import { LoadingOverlay } from "@/components/ui/loading-overlay"

function ParentDashboardContent({ children }: { children: React.ReactNode }) {
  const { showSpinner } = useLoading()

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <SidebarProvider>
        <Card className="w-full lg:w-[200px] h-fit">
          <ParentSidebar routes={ParentRoutes} />
        </Card>
      </SidebarProvider>
      {children}
      
      {/* Smart loading overlay */}
      <LoadingOverlay 
        isVisible={showSpinner} 
        message="Loading page..."
      />
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
