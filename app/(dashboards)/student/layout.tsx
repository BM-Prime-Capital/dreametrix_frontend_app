import React from "react";
import { Card } from "@/components/ui/card";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentRoutes } from "@/constants/routes";
import { SidebarProvider } from "@/lib/SidebarContext";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
        <SidebarProvider>
          <Card className="w-full lg:w-[280px] h-fit bg-card border-border shadow-sm">
            <StudentSidebar routes={StudentRoutes} />
          </Card>
        </SidebarProvider>
        
        <main className="flex-1 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
