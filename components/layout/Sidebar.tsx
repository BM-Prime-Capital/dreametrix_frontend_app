"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  UserRound,
  GraduationCap,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/libs/utils"

const routes = [
  {
    path: "/school_admin/classes",
    icon: Home,
    label: "HOME",
    color: "text-blue-500",
  },
  {
    path: "/school_admin/teachers",
    icon: Users,
    label: "TEACHERS",
    color: "text-orange-500",
  },
  {
    path: "/school_admin/parents",
    icon: UserRound,
    label: "PARENTS",
    color: "text-green-500",
  },
  {
    path: "/school_admin/students",
    icon: GraduationCap,
    label: "STUDENTS",
    color: "text-orange-500",
  },
  {
    path: "/school_admin/communicate",
    icon: MessageSquare,
    label: "COMMUNICATE",
    color: "text-green-500",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-2">
      {routes.map((route, index) => {
        const Icon = route.icon
        const isActive = pathname === route.path

        return (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              "flex items-center gap-3 p-4 text-sm rounded-md transition-colors",
              "hover:bg-blue-500 hover:text-white",
              isActive ? "bg-blue-500 text-white" : "bg-white",
              index === 0 && "rounded-t-lg",
              index === routes.length - 1 && "rounded-b-lg"
            )}
          >
            <Icon className={cn("w-4 h-4", !isActive && route.color)} />
            <span>{route.label}</span>
          </Link>
        )
      })}
    </div>
  )
}