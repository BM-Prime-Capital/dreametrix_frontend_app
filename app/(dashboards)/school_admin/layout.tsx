"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Sidebar } from "@/components/layout/Sidebar"
import { ActivityFeed } from "@/components/layout/ActivityFeed"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/libs/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [showMobileActivity, setShowMobileActivity] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          {showMobileSidebar ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
        <h1 className="text-xl font-semibold text-blue-500">DreaMetrix</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMobileActivity(!showMobileActivity)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M18 6v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" />
            <path d="M3 6v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6" />
            <path d="M3 6h18" />
            <path d="M15 3h-6" />
          </svg>
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          showMobileSidebar ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 bg-black/20" onClick={() => setShowMobileSidebar(false)} />
        <Card className="fixed left-0 top-0 bottom-0 w-[240px] rounded-none p-4 overflow-y-auto">
          <Sidebar />
        </Card>
      </div>

      {/* Mobile Activity Feed */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          showMobileActivity ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 bg-black/20" onClick={() => setShowMobileActivity(false)} />
        <Card className="fixed right-0 top-0 bottom-0 w-[300px] rounded-none p-4 overflow-y-auto">
          <ActivityFeed />
        </Card>
      </div>

      {/* Desktop Layout */}
      <div className="lg:flex gap-8 p-4 lg:p-8 max-w-[1600px] mx-auto">
        {/* Left Sidebar - Desktop */}
        <Card className="hidden lg:block w-[240px] h-fit p-4 shrink-0">
          <Sidebar />
        </Card>

        {/* Main Content */}
        <div className="flex-1 mt-16 lg:mt-0">
          {children}
        </div>

        {/* Right Sidebar - Activity Feed - Desktop */}
        <Card className="hidden lg:block w-[300px] h-fit p-4 shrink-0">
          <ActivityFeed />
        </Card>
      </div>
    </div>
  )
}