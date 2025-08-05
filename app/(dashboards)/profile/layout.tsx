"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TeacherRoutes, StudentRoutes, ParentRoutes, SchoolAdminRoutes } from "@/constants/routes";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";
import { localStorageKey } from "@/constants/global";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const [userRole, setUserRole] = useState('teacher');

  useEffect(() => {
    const userData = localStorage.getItem(localStorageKey.USER_DATA);
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserRole(parsedData.role || 'teacher');
    }
  }, []);

  const getRoutesForRole = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'teacher': return TeacherRoutes;
      case 'student': return StudentRoutes;
      case 'parent': return ParentRoutes;
      case 'admin': case 'school_admin': return SchoolAdminRoutes;
      default: return TeacherRoutes;
    }
  };

  return (
    <>
      <Sidebar routes={getRoutesForRole(userRole)} />
      <div className={`transition-all duration-500 ${isCollapsed ? "ml-16" : "ml-64"}`}>
        {children}
      </div>
    </>
  );
}

export default function ProfileLayout({
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