import React from "react";
import { Card } from "@/components/ui/card";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentRoutes } from "@/constants/routes";
import { SidebarProvider } from "@/lib/SidebarContext";
export default function SchoolAminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <SidebarProvider>
      <Card className="w-full lg:w-[200px] h-fit">
        <StudentSidebar routes={StudentRoutes} />
      </Card>
    </SidebarProvider>
      
      {children}
    </div>
  );
}
