"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { userPath, userTitle } from "@/constants/userConstants";

const portalButtons = [
  { label: userTitle.TEACHER, path: userPath.TEACHER_LOGIN_PATH }, // TODO : This gonna change to DASHBOARD paths etc, then in the teacher middleware we're gonna check if there is a loged in teacher
  { label: userTitle.STUDENT, path: userPath.STUDENT_LOGIN_PATH },
  { label: userTitle.PARENT, path: userPath.PARENT_LOGIN_PATH },
  { label: userTitle.SCHOOL_ADMIN, path: userPath.SCHOOL_ADMIN_LOGIN_PATH },
];

export default function PortalSelection() {
  const router = useRouter();
  const handleSchoolSelect = (schoolId: string) => {
    router.push(`/school/auth/login?school=${schoolId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Select Your Portal
        </h1>

        <div className="grid gap-4">
          {portalButtons.map((button) => (
            <Button
              key={button.label}
              onClick={() => router.push(button.path)}
              className="w-full bg-[#25AAE1] hover:bg-[#1E8BB3]"
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
