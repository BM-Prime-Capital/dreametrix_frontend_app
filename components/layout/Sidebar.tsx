"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind";
import Image from "next/image";
import { Card } from "../ui/card";
import { MenuRoute } from "@/types";
import { isMenuItemActive } from "@/utils/routes";

export function Sidebar({ routes }: { routes: MenuRoute[] }) {
  const pathname = usePathname();


  return (
    <Card className="w-full lg:w-fit h-fit lg:rounded-tr-none lg:rounded-br-none">
      <div className="p-4 flex flex-row lg:flex-col gap-2 overflow-x-scroll md:overflow-hidden">
        {routes.map((route: any) => {
          const iconPath = route.icon;
          const isActive = isMenuItemActive(route, pathname);

          return (
            <Link
              key={route.path}
              href={route.path}

              className={cn(
                "flex flex-shrink-0 items-center gap-4 p-2 pr-6 text-sm rounded-md whitespace-nowrap transition-colors",
                "hover:bg-blue-50 hover:text-blue-600 border-b",
                isActive && "bg-blue-50 text-blue-600"
              )}
            >
              <Image
                src={iconPath}
                alt="Icon"
                width={100}
                height={100}
                className="w-7 h-7"
                title={route.label}
              />
              <span className="hidden sm:inline">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
