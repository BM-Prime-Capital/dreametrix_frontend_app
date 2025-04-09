"use client"

import { ActivityFeed } from "../layout/ActivityFeed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, MessageCircle, Users } from "lucide-react"
import PageTitleH1 from "../ui/page-title-h1"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import StudentClassesDialog from "./StudentClassesDialog"

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("john")

  // Sample children data
  const children = [
    { id: "john", name: "John Smith", grade: "5th Grade", avatar: "" },
    { id: "emma", name: "Emma Smith", grade: "3rd Grade", avatar: "" },
  ]

  const selectedChildData = children.find((child) => child.id === selectedChild)

  return (
    <section className="flex flex-col gap-6 w-full">
      <PageTitleH1 title="PARENT DASHBOARD" />

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="flex-1 space-y-6">
          {/* Profile Header Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="text-xl font-medium mb-2">Parent Smith</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <MessageCircle className="h-5 w-5 text-[#25AAE1]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <Users className="h-5 w-5 text-[#25AAE1]" />
                  </Button>
                </div>
              </div>
              <div className="ml-auto">
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Child Information Card */}
          {selectedChildData && (
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-700">Child Information</h2>
                <StudentClassesDialog studentName={selectedChildData.name} />
              </div>

              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedChildData.avatar} />
                  <AvatarFallback>{selectedChildData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">{selectedChildData.name}</h3>
                  <p className="text-sm text-gray-500">{selectedChildData.grade}</p>
                  <p className="text-sm text-gray-500">ID: 0366ANH55</p>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Card */}
          <Card className="p-4 sm:p-6">
            <div className="space-y-4">
              <h2 className="text-lg text-gray-700">Upcoming Events & Reminders</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-amber-400" />
                  <p className="text-sm text-gray-600">
                    <span className="text-gray-700 font-medium">{selectedChildData?.name}</span> has a Math exam
                    tomorrow
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-amber-400" />
                  <p className="text-sm text-gray-600">
                    Parent-Teacher conference scheduled for{" "}
                    <span className="text-gray-700 font-medium">Friday, 3:00 PM</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-amber-400" />
                  <p className="text-sm text-gray-600">
                    School field trip permission slip due by{" "}
                    <span className="text-gray-700 font-medium">Wednesday</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Edit Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">Parent Profile</h2>

              <div className="flex flex-col items-center gap-2 mb-8">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Change</span>
              </div>

              <div className="w-full px-4 sm:px-8 md:px-12 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="username">
                      Full Name
                    </label>
                    <Input id="username" placeholder="Parent Smith" className="bg-gray-50 h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <Input id="email" placeholder="parent.smith@example.com" className="bg-gray-50 h-11" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="phone">
                      Phone
                    </label>
                    <Input id="phone" placeholder="(555) 123-4567" className="bg-gray-50 h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="address">
                      Address
                    </label>
                    <Input id="address" placeholder="123 Main St, City" className="bg-gray-50 h-11" />
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
