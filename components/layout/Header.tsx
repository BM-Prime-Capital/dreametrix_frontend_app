"use client"

import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { ChevronDown, LogOut, User, Settings } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { localStorageKey } from "@/constants/global"
import { cn } from "@/lib/utils"
import DreaMetrixLogo from "../ui/dreametrix-logo"
import UserAvatar from "../ui/user-avatar"

export function Header() {
  const router = useRouter()

  const getUserData = (): { full_name: string } => {
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-3 items-center px-4 sm:px-6 lg:px-8">
        {/* Espace gauche (vide mais structurant) */}
        <div className="flex items-center justify-start">
          {/* Élément invisible pour équilibrer la grille */}
          <div className="opacity-0">
            <UserAvatar className="h-9 w-9" />
          </div>
        </div>

        {/* Logo parfaitement centré */}
        <div className="flex items-center justify-center">
          <DreaMetrixLogo height={28} className="mx-auto" />
        </div>

        {/* Menu utilisateur aligné à droite */}
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full p-1 pr-3 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              <UserAvatar className="h-9 w-9 border-2 border-white shadow-sm" />
              <span className="text-sm font-medium text-gray-800">{full_name}</span>
              <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="end" 
              className="min-w-[200px] rounded-xl border border-gray-100 p-2 shadow-xl"
            >
              <DropdownMenuItem className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:bg-primary/10">
                  <User className="h-4 w-4" />
                </div>
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 group-hover:bg-primary/10">
                  <Settings className="h-4 w-4" />
                </div>
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="mx-2 my-1 h-px bg-gray-100" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "text-red-600 hover:bg-red-50 focus:bg-red-50"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <LogOut className="h-4 w-4" />
                </div>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}