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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo and navigation */}
        <div className="flex items-center gap-4 lg:gap-6">
          <DreaMetrixLogo height={28} />
          
          <div className="hidden md:flex md:gap-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Dashboard</Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Classes</Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Students</Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Resources</Button>
          </div>
        </div>

        {/* Search and user actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:block relative w-full max-w-[240px] lg:max-w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-9 h-9 w-full bg-muted/50 border-muted focus-visible:bg-background" 
            />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="group flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-muted focus-visible:ring-primary"
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
              
              <DropdownMenuItem className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
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