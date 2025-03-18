"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import DreaMetrixLogo from "../ui/dreametrix-logo";

export function Header() {
  const router = useRouter();
  return (
    <header className="flex flex-col px-20">
      <div className="flex items-center gap-2 justify-center">
        {/*  <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button> */}
        <DreaMetrixLogo />
      </div>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="text-gray-700">Dashboard</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/")}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
