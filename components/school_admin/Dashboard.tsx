"use client"

import { useEffect, useState } from "react"
import { ActivityFeed } from "@/components/layout/ActivityFeed"
import { AIAssistance } from "./ai-assistance"
import { Card } from "@/components/ui/card"
import PageTitleH1 from "../ui/page-title-h1"
import SchoolAdminHeader from "./Header"
import ProfileCard from "./profile-card"

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

          <Card className="p-4 sm:p-6 bg-[#DFECF2]">
            <AIAssistance />
          </Card>

          <ProfileCard userData={userData || {}} tenantData={tenantData || {}} />
        </div>

        <ActivityFeed />
      </div>
    </section>
  )
}

