import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/Sidebar";
import { TeacherRoutes } from "@/constants/routes";

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <Sidebar routes={TeacherRoutes} />
      {children}
    </div>
  );
}
