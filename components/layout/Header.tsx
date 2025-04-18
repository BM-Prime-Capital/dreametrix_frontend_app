"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import DreaMetrixLogo from "../ui/dreametrix-logo"
import UserAvatar from "../ui/user-avatar"
import { localStorageKey } from "@/constants/global"
import Cookies from "js-cookie"

export function Header() {
  const router = useRouter()

  // Safely parse user data with error handling and default values
  const getUserData = () => {
    try {
      const userData = localStorage.getItem(localStorageKey.USER_DATA)
      if (!userData) return { full_name: "Guest" }

      const parsedData = JSON.parse(userData)
      return {
        full_name: parsedData?.full_name || "Guest",
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      return { full_name: "Guest" }
    }
  }

  const { full_name } = getUserData()

  const logout = () => {
    Cookies.remove("tenantDomain")
    Cookies.remove(localStorageKey.ACCESS_TOKEN)
    localStorage.clear()

    router.push("/")
  }

  return (
    <header className="flex flex-col px-5 md:px-20">
      <div className="flex items-center gap-2 pt-4 justify-center">
        {/*  <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button> */}
        <DreaMetrixLogo />
      </div>
      <div className="flex justify-end mt-2 md:mt-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-white px-2 py-2 rounded-full border">
            <UserAvatar />
            <span className="text-gray-700">{full_name}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

