import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/Sidebar";
import { SchoolAdminRoutes } from "@/constants/routes";
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
          <Sidebar routes={SchoolAdminRoutes} />
        </Card>
      </SidebarProvider>
        {children}
      </div>
  );
}
