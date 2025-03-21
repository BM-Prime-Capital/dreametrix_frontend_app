"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/tailwind"
import Image from "next/image"
import type { MenuRoute } from "@/types"

export function Sidebar({ routes }: { routes: MenuRoute[] }) {
  const pathname = usePathname()

  return (
    <div className="w-[220px] rounded-lg shadow-sm bg-white overflow-hidden">
      <div className="flex flex-col">
        {routes.map((route: MenuRoute, index) => {
          const iconPath = route.icon
          const isActive = pathname === route.path

          return (
            <div key={route.path} className="relative">
              <Link
                href={route.path}
                className={cn(
                  "flex items-center gap-3 py-4 px-5 text-sm font-medium transition-colors",
                  isActive ? "bg-[#25AAE1] text-white" : "text-gray-600 hover:bg-gray-50",
                )}
              >
                <Image
                  src={iconPath || "/placeholder.svg"}
                  alt={route.label}
                  width={20}
                  height={20}
                  className={cn("w-5 h-5", isActive ? "brightness-0 invert" : "")}
                />
                <span className="uppercase tracking-wide">{route.label}</span>
              </Link>
              {!isActive && index < routes.length - 1 && <div className="h-[1px] bg-gray-200 mx-5" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

