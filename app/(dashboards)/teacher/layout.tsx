"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TeacherRoutes } from "@/constants/routes";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <>
      <Sidebar routes={TeacherRoutes} />
      <div className={`transition-all duration-500 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {children}
      </div>
    </>
  );
}

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
