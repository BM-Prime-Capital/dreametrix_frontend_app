"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  UserRound,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/utils/tailwind";

const routes = [
  {
    path: "/school/home",
    icon: Home,
    label: "HOME",
  },
  {
    path: "/school/teachers",
    icon: Users,
    label: "TEACHERS",
  },
  {
    path: "/parents",
    icon: UserRound,
    label: "PARENTS",
  },
  {
    path: "/students",
    icon: GraduationCap,
    label: "STUDENTS",
  },
  {
    path: "/communicate",
    icon: MessageSquare,
    label: "COMMUNICATE",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive = pathname === route.path;

        return (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              "flex items-center gap-2 p-2 text-sm rounded-md whitespace-nowrap transition-colors",
              "hover:bg-blue-50 hover:text-blue-600",
              isActive && "bg-blue-50 text-blue-600"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{route.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
