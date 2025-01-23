"use client"

import { useRouter } from "next/navigation"

interface PortalButton {
  label: string
  path: string
}

const portalButtons: PortalButton[] = [
  { label: "TEACHERS", path: "/dashboard/teachers" },
  { label: "STUDENTS", path: "/dashboard/students" },
  { label: "PARENTS", path: "/dashboard/parents" },
  { label: "SCHOOLS", path: "/school/auth/login" },
]

export default function LoginPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col gap-4 w-full max-w-[200px]">
        {portalButtons.map((button) => (
          <button
            key={button.label}
            onClick={() => router.push(button.path)}
            className="w-full px-6 py-3 bg-[#33CCFF] hover:bg-[#2BB8E6] text-white 
                     font-medium text-sm uppercase tracking-wide rounded-md 
                     transition-colors duration-200"
          >
            {button.label}
          </button>
        ))}
      </div>
    </main>
  )
}

