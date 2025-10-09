import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/Sidebar";
import { SuperAdminRoutes } from "@/constants/routes";
import { SidebarProvider } from "@/lib/SidebarContext";
import { ProtectedRoute } from "@/components/Support/ProtectedRoute";
import { userTypeEnum } from "@/constants/userConstants";

export default function SchoolAminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedUserTypes={[userTypeEnum.SUPER_ADMIN]}>
    <SidebarProvider>
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="w-full lg:w-[200px] h-fit">
          <Sidebar routes={SuperAdminRoutes} />
        </Card>
        {children}
      </div>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
