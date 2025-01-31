"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { userPath, userTitle } from "@/constants/userConstants"

const portalButtons = [
  { label: userTitle.TEACHER, path: userPath.TEACHER_LOGIN_PATH },
  { label: userTitle.STUDENT, path: userPath.STUDENT_LOGIN_PATH },
  { label: userTitle.PARENT, path: userPath.PARENT_LOGIN_PATH },
  { label: userTitle.SCHOOL_ADMIN, path: userPath.SCHOOL_ADMIN_LOGIN_PATH },
]

export default function PortalSelection() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 space-y-8">
        <div className="flex justify-center">
          <Image
            src="/assets/images/logo.png"
            alt="DreaMetrix Logo"
            width={150}
            height={45}
            priority
            className="mb-[50px]"
          />
        </div>

        <div className="space-y-4">
          {portalButtons.map((button) => (
            <button
              key={button.label}
              onClick={() => router.push(button.path)}
              className="w-full bg-[#29a1e8] text-white py-[15px] px-4 text-base rounded-[20px] border-none cursor-pointer mt-[10px]"
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

