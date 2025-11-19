"use client";

import React from "react";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentRoutes } from "@/constants/routes";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/components/Support/ProtectedRoute";
import { userTypeEnum } from "@/constants/userConstants";
import { OnboardingProvider } from "@/lib/OnboardingContext";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { studentTourSteps } from "@/constants/onboarding/studentTour";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { MandatoryTasksBanner } from "@/components/onboarding/MandatoryTasksBanner";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <StudentSidebar routes={StudentRoutes} />
      <div
        className={`transition-all duration-500 ${isCollapsed ? "ml-16" : "ml-64"} w-full`}
      >
        <MandatoryTasksBanner className="mb-6" />
        {children}
        <OnboardingTour 
          steps={studentTourSteps}
        />
      </div>
      </>
  );
}

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useRequestInfo();
  
  return (
    <ProtectedRoute allowedUserTypes={[userTypeEnum.STUDENT]}>
    <SidebarProvider>
      <OnboardingProvider userId={userId || ''} userRole="student">
        <div className="min-h-screen flex">
          <LayoutContent>{children}</LayoutContent>
          <Toaster position="top-right" richColors />
        </div>
      </OnboardingProvider>
    </SidebarProvider>
    </ProtectedRoute>
  );
  
}
