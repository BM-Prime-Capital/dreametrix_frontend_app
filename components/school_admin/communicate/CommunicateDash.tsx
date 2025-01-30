"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, MessageSquare, Phone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommunicateTable } from "./communicate-table"
import { useState } from "react"

export default function CommunicatePage() {
  const [selectedTab, setSelectedTab] = useState("individual-teacher")

  return (
    <div className="w-full space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight text-blue-500">COMMUNICATE</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">All Messages</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                <MessageSquare className="h-4 w-4" />
                Compose
              </Button>
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                External
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="individual-teacher" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto gap-2">
              <TabsTrigger value="individual-teacher" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Individual Teacher
              </TabsTrigger>
              <TabsTrigger value="whole-classes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Whole Classes
              </TabsTrigger>
              <TabsTrigger value="individual-parents" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Individual Parents
              </TabsTrigger>
              <TabsTrigger value="all-parents" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                All Parents
              </TabsTrigger>
              <TabsTrigger value="other-groups" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Other Groups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual-teacher">
              <CommunicateTable type="teacher" />
            </TabsContent>
            <TabsContent value="whole-classes">
              <CommunicateTable type="class" />
            </TabsContent>
            <TabsContent value="individual-parents">
              <CommunicateTable type="parent" />
            </TabsContent>
            <TabsContent value="all-parents">
              <CommunicateTable type="all-parents" />
            </TabsContent>
            <TabsContent value="other-groups">
              <CommunicateTable type="group" />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}