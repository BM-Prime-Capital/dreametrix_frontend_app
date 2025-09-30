"use client"

import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Bell, ChevronDown, LogOut, User, Settings, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { localStorageKey } from "@/constants/global"
import { cn } from "@/utils/tailwind"
import DreaMetrixLogo from "../ui/dreametrix-logo"
import UserAvatar from "../ui/user-avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import Link from "next/link"

export function Header() {
  const router = useRouter()

  const getUserData = (): { full_name: string } => {
    if (typeof window === 'undefined') return { full_name: "Guest" }
    
    try {
      const userData = localStorage.getItem(localStorageKey.USER_DATA)
      return userData 
        ? JSON.parse(userData) 
        : { full_name: "Guest" }
    } catch (error) {
      console.error("Error parsing user data:", error)
      return { full_name: "Guest" }
    }
  }

  const { full_name } = getUserData()

  const handleLogout = () => {
    Cookies.remove("tenantDomain")
    Cookies.remove(localStorageKey.ACCESS_TOKEN)
    localStorage.clear()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl shadow-lg">
      {/* Glass overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5"></div>
      
      <div className="relative container flex h-16 items-center justify-between gap-4 z-10">
        {/* Left spacer */}
        <div className="flex-1"></div>
        
        {/* Centered Logo */}
        <div className="flex items-center">
          <DreaMetrixLogo height={28} />
        </div>

        {/* Search and user actions */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Search */}
          {/* <div className="hidden md:block relative w-full max-w-[240px] lg:max-w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-9 h-9 w-full bg-white/20 backdrop-blur-md border-white/30 focus-visible:bg-white/30 rounded-xl" 
            />
          </div>
           */}
          {/* Notifications */}
          {/* <Button variant="ghost" size="icon" className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"></span>
            <span className="sr-only">Notifications</span>
          </Button> */}
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="group flex items-center gap-2 rounded-2xl p-1 pr-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 focus-visible:ring-white/30 transition-all duration-300"
              >
                <UserAvatar className="h-8 w-8 border border-border shadow-sm" />
                <span className="hidden md:inline text-sm font-medium">{full_name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="end" 
              className="min-w-[220px] rounded-xl p-2 shadow-dropdown"
            >
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-medium">{full_name}</p>
                <p className="text-xs text-muted-foreground">Teacher</p>
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => router.push('/profile')}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-muted text-primary">
                  <User className="h-4 w-4" />
                </div>
                <span>My Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-muted text-primary">
                  <Settings className="h-4 w-4" />
                </div>
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                  "text-destructive hover:bg-destructive-muted focus:bg-destructive-muted"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive-muted text-destructive">
                  <LogOut className="h-4 w-4" />
                </div>
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}