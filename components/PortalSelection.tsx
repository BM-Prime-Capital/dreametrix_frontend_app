"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { userPath, userTitle } from "@/constants/userConstants";

const portalButtons = [
  { label: userTitle.TEACHER, path: userPath.TEACHER_LOGIN_PATH },
  { label: userTitle.STUDENT, path: userPath.STUDENT_LOGIN_PATH },
  { label: userTitle.PARENT, path: userPath.PARENT_LOGIN_PATH },
  { label: userTitle.SCHOOL_ADMIN, path: userPath.SCHOOL_ADMIN_LOGIN_PATH },
];

export default function PortalSelection() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f9f9f9]">
      <div className="text-center w-full max-w-md px-6">
        <div className="flex justify-center mb-[50px]">
          <Image
            src="/assets/images/logo.png"
            alt="DreaMetrix Logo"
            width={150}
            height={45}
            priority
            className="w-[150px]"
          />
        </div>

        <div className="space-y-2.5">
          {portalButtons.map((button) => (
            <div key={button.label}>
              <button
                onClick={() => router.push(button.path)}
                className="w-full bg-[#29a1e8] hover:bg-[#217bb4] text-white py-[15px] px-4 
                         text-base rounded-[20px] border-none cursor-pointer transition-colors
                         focus:outline-none focus:ring-2 focus:ring-[#29a1e8] focus:ring-offset-2"
              >
                {button.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}