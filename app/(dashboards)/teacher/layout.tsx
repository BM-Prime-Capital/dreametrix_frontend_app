"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TeacherRoutes } from "@/constants/routes";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";
import { ProtectedRoute } from "@/components/Support/ProtectedRoute";
import { userTypeEnum } from "@/constants/userConstants";
import { OnboardingProvider } from "@/lib/OnboardingContext";
import { MandatoryTasksBanner } from "@/components/onboarding/MandatoryTasksBanner";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { teacherTourSteps } from "@/constants/onboarding/teacherTour";
import { useRequestInfo } from "@/hooks/useRequestInfo";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <Sidebar routes={TeacherRoutes} data-tour="sidebar" />

      <div
        className={`transition-all duration-500 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <MandatoryTasksBanner className="mb-6" />
        {children}
        <OnboardingTour 
          steps={teacherTourSteps}
          run={false}
        />
      </div>
    </>
  );
}

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useRequestInfo();
  
  return (
    <ProtectedRoute allowedUserTypes={[userTypeEnum.TEACHER]}>
      <SidebarProvider>
        <OnboardingProvider userId={userId || ''} userRole="teacher">
          <LayoutContent>{children}</LayoutContent>
        </OnboardingProvider>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
