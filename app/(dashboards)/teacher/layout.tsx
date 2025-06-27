import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TeacherRoutes } from "@/constants/routes";

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar routes={TeacherRoutes} />
      <div className="ml-64 transition-all duration-500">
        {children}
      </div>
    </>
  );
}
