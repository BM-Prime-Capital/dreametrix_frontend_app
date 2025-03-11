"use client"

import { useEffect, useState } from "react"
import { ActivityFeed } from "../layout/ActivityFeed"
import { AIAssistance } from "./ai-assistance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PageTitleH1 from "../ui/page-title-h1"
import SchoolAdminHeader from "./Header"

interface UserData {
  id: number
  role: string
  email: string
  username: string
  picture: string
}

interface TenantData {
  name: string
  code: string
  primary_domain: string
}

export default function SchoolAdminDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [tenantData, setTenantData] = useState<TenantData | null>(null)

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    const storedTenantData = localStorage.getItem("tenantData")

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }
    if (storedTenantData) {
      setTenantData(JSON.parse(storedTenantData))
    }
  }, [])

  return (
    <section className="flex flex-col gap-6 w-full">
      <PageTitleH1 title="Dashboard" />

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="flex-1 space-y-6">
          <SchoolAdminHeader userData={userData} tenantData={tenantData} />

          <Card className="p-4 sm:p-6">
            <AIAssistance />
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Profile</h2>

              <div className="flex flex-col items-center gap-2 mb-8">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData?.picture || "/placeholder.svg"} />
                  <AvatarFallback>{userData?.username?.slice(0, 2).toUpperCase() || "SL"}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Change</span>
              </div>

              <div className="w-full px-4 sm:px-8 md:px-12 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="username">
                      Username
                    </label>
                    <Input id="username" value={userData?.username || ""} className="bg-gray-50 h-11" readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <Input id="email" value={userData?.email || ""} className="bg-gray-50 h-11" readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="school">
                      School
                    </label>
                    <Input id="school" value={tenantData?.name || ""} className="bg-gray-50 h-11" readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="role">
                      Role
                    </label>
                    <Input id="role" value={userData?.role || ""} className="bg-gray-50 h-11" readOnly />
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <Button className="w-full bg-[#25AAE1] hover:bg-[#1E86B3] h-11 text-base">UPDATE PROFILE</Button>
                  <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <ActivityFeed />
      </div>
    </section>
  )
}

