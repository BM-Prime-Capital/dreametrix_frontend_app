"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind";
import Image from "next/image";
import { MenuRoute } from "@/types";
import { isMenuItemActive } from "@/utils/routes";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "@/lib/SidebarContext";
import DreaMetrixLogo from "../ui/dreametrix-logo";

export function Sidebar({ routes }: { routes: MenuRoute[] }) {
  console.log("routes", routes)
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div 
      data-tour="sidebar"
      className={cn(
        "fixed left-0 top-0 h-screen transition-all duration-500 ease-in-out flex flex-col z-40",
        "bg-gradient-to-b from-white via-slate-50/80 to-gray-100/60",
        "border-r border-gray-200/60 backdrop-blur-sm",
        "shadow-xl shadow-gray-900/5",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-4 top-20 z-20 h-8 w-8 rounded-full",
          "bg-white/90 backdrop-blur-sm border border-gray-200/60",
          "shadow-lg hover:shadow-xl transition-all duration-300",
          "hover:bg-white hover:scale-110",
          "flex items-center justify-center p-0"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-700" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        )}
      </Button>

      {/* Logo/Brand Area */}
      <div className={cn(
        "p-6 border-b border-gray-200/40",
        "flex items-center justify-center backdrop-blur-sm"
      )}>
        {!isCollapsed && (
          <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            DreaMetrix
          </h2>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">D</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-2">
          {routes.map((route) => {
            const isActive = isMenuItemActive(route, pathname);
            const isDisabled = route.disabled;
            
            const tourId = route.label.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            
            const routeContent = (
              <div
                className={cn(
                  "group flex items-center gap-4 px-4 py-3 text-sm rounded-2xl transition-all duration-300 w-full",
                  "hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80",
                  "hover:shadow-md hover:scale-[1.02] hover:backdrop-blur-sm",
                  "active:scale-[0.98]",
                  isActive && !isDisabled
                    ? "bg-gradient-to-r from-blue-100/90 to-purple-100/90 text-blue-700 font-semibold shadow-md backdrop-blur-sm" 
                    : "text-gray-700 hover:text-gray-900",
                  // Styles pour les routes désactivées
                  isDisabled && [
                    "opacity-50 cursor-not-allowed",
                    "hover:bg-transparent hover:shadow-none hover:scale-100",
                    "active:scale-100",
                    "border border-dashed border-gray-300/60"
                  ]
                )}
                title={isCollapsed ? `${route.label}${isDisabled ? ' (Disabled)' : ''}` : undefined}
              >
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 transition-all duration-300 flex-shrink-0",
                  isActive && !isDisabled ? "text-blue-600 scale-110" : "text-gray-500 group-hover:text-gray-700 group-hover:scale-105",
                  isDisabled && [
                    "text-gray-400",
                    "group-hover:text-gray-400 group-hover:scale-100"
                  ]
                )}>
                  {typeof route.icon === 'string' ? (
                    <Image
                      src={route.icon}
                      alt={route.label}
                      width={20}
                      height={20}
                      className={cn(
                        "w-5 h-5 object-contain",
                        isDisabled && "opacity-60"
                      )}
                    />
                  ) : (
                    route.icon
                  )}
                </div>
                {!isCollapsed && (
                  <span className={cn(
                    "font-medium transition-all duration-300 truncate",
                    isDisabled && "text-gray-500"
                  )}>
                    {route.label}
                  </span>
                )}
                {isActive && !isDisabled && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex-shrink-0 animate-pulse" />
                )}
                {isDisabled && !isCollapsed && (
                  <div className="ml-auto text-xs text-gray-400 font-medium px-2 py-1 bg-gray-100 rounded-md flex-shrink-0">
                    Soon
                  </div>
                )}
              </div>
            );

            if (isDisabled) {
              return (
                <div key={route.path} className="relative">
                  {routeContent}
                  {/* Tooltip pour l'état désactivé */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {route.label} (Disabled)
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={route.path}
                data-tour={`${tourId}-menu`}
                className="w-full relative"
              >
                <Link
                  href={route.path}
                  className="block w-full"
                >
                  {routeContent}
                </Link>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className={cn(
        "p-4 border-t border-gray-200/40 flex-shrink-0 backdrop-blur-sm",
        "flex items-center justify-center"
      )}>
        {!isCollapsed && (
          <div className="flex justify-center mb-6 w-[80px]">
            <DreaMetrixLogo />
          </div>
        )}
      </div>
    </div>
  );
}