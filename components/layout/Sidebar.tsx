"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind";
import Image from "next/image";
import { Card } from "../ui/card";
import { MenuRoute } from "@/types";
import { isMenuItemActive } from "@/utils/routes";
import { ScrollArea } from "../ui/scroll-area";

export function Sidebar({ routes }: { routes: MenuRoute[] }) {
  const pathname = usePathname();

  return (
    <Card 
      variant="flat" 
      radius="lg"
      className="w-full lg:w-64 h-full border-r lg:rounded-tr-none lg:rounded-br-none shadow-none"
    >
      <ScrollArea className="h-full">
        <div className="p-2 space-y-1">
          {routes.map((route) => {
            const iconPath = route.icon;
            const isActive = isMenuItemActive(route, pathname);
            
            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all",
                  "hover:bg-primary-muted hover:text-primary",
                  isActive 
                    ? "bg-primary-muted text-primary font-medium" 
                    : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-6 h-6",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  <Image
                    src={iconPath}
                    alt=""
                    width={24}
                    height={24}
                    className="w-5 h-5 object-contain"
                    aria-hidden="true"
                  />
                </div>
                <span>{route.label}</span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
