"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/libs/utils"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { MenuRoute } from "@/types"
import { useLoading } from "@/lib/LoadingContext"

export function ParentSidebar({ routes }: { routes: MenuRoute[] }) {
  const pathname = usePathname()
  const { startLoading } = useLoading()

  const handleLinkClick = (targetPath: string) => {
    // Démarrer le chargement seulement si on clique sur un lien différent de la page actuelle
    if (pathname !== targetPath) {
      startLoading()
    }
  }

  return (
    <Card className="w-full lg:w-[280px] h-fit lg:sticky lg:top-6 rounded-2xl bg-white border-0 shadow-xl overflow-hidden">
      {/* Header du sidebar */}
      <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg">Parent</h2>
            <p className="text-white/80 text-sm">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[calc(100vh-200px)]">
        {routes.map((route) => {
          const isActive = pathname === route.path
          const iconSrc = typeof route.icon === 'string' ? route.icon : ""
          const tourId = route.label.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

          return (
            <Link
              key={route.path}
              href={route.path}
              onClick={() => handleLinkClick(route.path)}
              data-tour={`${tourId}-menu`}
              className={cn(
                "flex flex-shrink-0 items-center gap-3 p-4 text-sm rounded-xl whitespace-nowrap transition-all duration-300",
                "hover:bg-gradient-to-r hover:from-[#25AAE1]/15 hover:to-[#1D8CB3]/15 hover:text-[#25AAE1] hover:shadow-md",
                isActive
                  ? "bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white shadow-lg font-semibold"
                  : "text-gray-600 hover:scale-105"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-white/20"
                  : "bg-gray-100 hover:bg-[#25AAE1]/10"
              )}>
                <Image
                  src={iconSrc}
                  alt={route.label}
                  width={16}
                  height={16}
                  className={cn(
                    "w-4 h-4 transition-all duration-300",
                    isActive ? "brightness-0 invert" : "opacity-70"
                  )}
                />
              </div>
              <span className={cn(
                "hidden lg:inline font-medium transition-all duration-300",
                isActive ? "text-white" : "text-gray-700"
              )}>
                {route.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Footer du sidebar */}
      {/* <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="bg-gradient-to-r from-[#25AAE1]/10 to-[#1D8CB3]/10 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-gray-600">Need Help?</p>
              <p className="text-xs text-gray-500">Contact Support</p>
            </div>
          </div>
        </div>
      </div> */}
    </Card>
  )
}
