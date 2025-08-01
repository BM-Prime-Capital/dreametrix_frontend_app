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

export function Sidebar({ routes }: { routes: MenuRoute[] }) {

  console.log("routes", routes)
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div 
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
            
            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "group flex items-center gap-4 px-4 py-3 text-sm rounded-2xl transition-all duration-300",
                  "hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80",
                  "hover:shadow-md hover:scale-[1.02] hover:backdrop-blur-sm",
                  "active:scale-[0.98]",
                  isActive 
                    ? "bg-gradient-to-r from-blue-100/90 to-purple-100/90 text-blue-700 font-semibold shadow-md backdrop-blur-sm" 
                    : "text-gray-700 hover:text-gray-900"
                )}
                title={isCollapsed ? route.label : undefined}
              >
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 transition-all duration-300 flex-shrink-0",
                  isActive ? "text-blue-600 scale-110" : "text-gray-500 group-hover:text-gray-700 group-hover:scale-105"
                )}>
                  {typeof route.icon === 'string' ? (
                    <Image
                      src={route.icon}
                      alt={route.label}
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    route.icon
                  )}
                </div>
                {!isCollapsed && (
                  <span className="font-medium transition-all duration-300 truncate">
                    {route.label}
                  </span>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex-shrink-0 animate-pulse" />
                )}
              </Link>
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
          <p className="text-xs text-gray-500 text-center font-medium">
            Teacher Portal
          </p>
        )}
      </div>
    </div>
  );
}
