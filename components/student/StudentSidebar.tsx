'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../libs/utils"
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { MenuRoute } from "@/types";

export function StudentSidebar({ routes }: { routes: MenuRoute[] }) {
  const pathname = usePathname();

  return (
    <Card className="w-full lg:w-[200px] h-fit lg:rounded-tr-none lg:rounded-br-none bg-white">
      <div className="p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
        {routes.map((route) => {
          const isActive = pathname === route.path;

          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex flex-shrink-0 items-center gap-3 p-3 text-sm rounded-md whitespace-nowrap transition-colors",
                "hover:bg-blue-50 hover:text-blue-600",
                isActive && "bg-blue-50 text-blue-600 font-medium"
              )}
            >
              <Image
                src={route.icon}
                alt={route.label}
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span className="hidden lg:inline">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}