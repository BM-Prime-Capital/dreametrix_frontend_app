"use client"

import { ActivityFeed } from "../layout/ActivityFeed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Instagram, MessageCircle } from "lucide-react"
import PageTitleH1 from "../ui/page-title-h1"
import { Bell } from "lucide-react"

export default function StudentDashboard() {
  return (
    <section className="flex flex-col gap-6 w-full">
      <PageTitleH1 title="PROFILE" />

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="flex-1 space-y-6">
          {/* Profile Header Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="text-xl font-medium mb-2">John Smith</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <Instagram className="h-5 w-5 text-[#25AAE1]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <MessageCircle className="h-5 w-5 text-[#25AAE1]" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Assistance Card */}
          <Card className="p-4 sm:p-6 space-x-8">
            <div className="space-y-4 space-x-8">
              <h2 className="text-lg text-gray-700">AI Student Assistance</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-amber-400" />
                  <p className="text-sm text-gray-600">
                    Remember that tomorrow <span className="text-gray-700">Class 5 - Math has an exam</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-amber-400" />
                  <p className="text-sm text-gray-600">
                    Remember that tomorrow <span className="text-gray-700">Class 5 - Sci has an exam</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Edit Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Profile</h2>

              <div className="flex flex-col items-center gap-2 mb-8">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Change</span>
              </div>

              <div className="w-full px-4 sm:px-8 md:px-12 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="username">
                      Username
                    </label>
                    <Input id="username" placeholder="John Smith" className="bg-gray-50 h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <Input id="email" placeholder="johnsmith@school.edu" className="bg-gray-50 h-11" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="school">
                      School
                    </label>
                    <Input id="school" placeholder="School1" className="bg-gray-50 h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="role">
                      Role
                    </label>
                    <Input id="role" placeholder="Student" className="bg-gray-50 h-11" />
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

        {/* Activity Feed */}
        <ActivityFeed />
      </div>
    </section>
  )
}

