"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind";
import Image from "next/image";
import { Card } from "../ui/card";

export function Sidebar({ routes }: { routes: MenuRoute[] }) {
  const pathname = usePathname();

  return (
    <Card className="w-full lg:w-[200px] h-fit lg:rounded-tr-none lg:rounded-br-none">
      <div className="p-4 flex flex-row lg:flex-col gap-2 overflow-x-scroll">
        {routes.map((route: any) => {
          const iconPath = route.icon;
          const isActive = pathname === route.path;

          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex flex-shrink-0 items-center gap-2 p-2 text-sm rounded-md whitespace-nowrap transition-colors",
                "hover:bg-blue-50 hover:text-blue-600 border-b",
                isActive && "bg-blue-50 text-blue-600"
              )}
            >
              <Image
                src={iconPath}
                alt="Icon"
                width={100}
                height={100}
                className="w-4 h-4"
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
