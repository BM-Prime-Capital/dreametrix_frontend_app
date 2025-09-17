import React from "react";
import { SidebarProvider } from "@/lib/SidebarContext";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentRoutes } from "@/constants/routes";
import { Toaster } from "sonner";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
        <SidebarProvider>
          <StudentSidebar routes={StudentRoutes} />
        </SidebarProvider>
        
        <main className="flex-1 bg-background">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
