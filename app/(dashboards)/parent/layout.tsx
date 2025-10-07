"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ParentSidebar } from "@/components/parents/ParentSidebar"
import { ParentRoutes } from "@/constants/routes"
import { SidebarProvider } from "@/lib/SidebarContext"
import { LoadingProvider, useLoading } from "@/lib/LoadingContext"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { EmptyParentState } from "@/components/parents/EmptyParentState"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useParentRelationship } from "@/hooks/useParentRelationship"
import { Loader2 } from "lucide-react"

function ParentDashboardContent({ children }: { children: React.ReactNode }) {
  const { showSpinner } = useLoading()
  const { accessToken } = useRequestInfo()
  const pathname = usePathname()
  const {
    hasLinkedStudents,
    hasPendingRequests,
    loading,
    error
  } = useParentRelationship(accessToken)

  // Pages that should bypass the empty state check
  const bypassPages = ["/parent/link-student", "/parent/communicate"]
  const shouldBypass = bypassPages.some(page => pathname?.startsWith(page))

  // Show loading while checking relationship status
  if (loading && !shouldBypass) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mx-auto" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show empty state if no students linked and no pending requests
  if (!hasLinkedStudents && !hasPendingRequests && !shouldBypass && !loading) {
    return <EmptyParentState variant="no-students" />
  }

  // Show pending state if has pending requests but no linked students
  if (!hasLinkedStudents && hasPendingRequests && !shouldBypass && !loading) {
    return <EmptyParentState variant="pending-requests" />
  }

  // Show error state if there's an error
  if (error && !shouldBypass && !loading) {
    return <EmptyParentState variant="error" message={error} />
  }

  // Normal dashboard view
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
