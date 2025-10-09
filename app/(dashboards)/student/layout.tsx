"use client";

import React from "react";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentRoutes } from "@/constants/routes";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/components/Support/ProtectedRoute";
import { userTypeEnum } from "@/constants/userConstants";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <StudentSidebar routes={StudentRoutes} />
      <div
        className={`transition-all duration-500 ${isCollapsed ? "ml-16" : "ml-64"} w-full`}
      >
        {children}
      </div>
      </>
  );
}

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedUserTypes={[userTypeEnum.STUDENT]}>
    <SidebarProvider>
      <div className="min-h-screen flex">
        <LayoutContent>{children}</LayoutContent>
        <Toaster position="top-right" richColors />
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
  
}
