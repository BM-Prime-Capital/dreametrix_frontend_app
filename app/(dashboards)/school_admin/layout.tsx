"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/Sidebar";
import { SchoolAdminRoutes } from "@/constants/routes";
import { SidebarProvider } from "@/lib/SidebarContext";
import { ProtectedRoute } from "@/components/Support/ProtectedRoute";
import { userTypeEnum } from "@/constants/userConstants";
import { OnboardingProvider } from "@/lib/OnboardingContext";
import { MandatoryTasksBanner } from "@/components/onboarding/MandatoryTasksBanner";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { schoolAdminTourSteps } from "@/constants/onboarding/schoolAdminTour";
import { useRequestInfo } from "@/hooks/useRequestInfo";

function SchoolAdminLayoutContent({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card className="w-full lg:w-[200px] h-fit" >
        <Sidebar routes={SchoolAdminRoutes} />
      </Card>
      <div className="flex-1">
        <MandatoryTasksBanner className="mb-6" />
        {children}
        <OnboardingTour 
          steps={schoolAdminTourSteps}
          run={false}
        />
      </div>
    </div>
  );
}

export default function SchoolAminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useRequestInfo();
  
  return (
    <ProtectedRoute allowedUserTypes={[userTypeEnum.SCHOOL_ADMIN]}>
      <SidebarProvider>
        <OnboardingProvider userId={userId || ''} userRole="school_admin">
          <SchoolAdminLayoutContent>{children}</SchoolAdminLayoutContent>
        </OnboardingProvider>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
