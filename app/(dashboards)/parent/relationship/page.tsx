"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Clock, Link2, Sparkles } from "lucide-react"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useParentPage } from "@/hooks/useParentPage"
import { useParentRelationship } from "@/hooks/useParentRelationship"
import { LinkedStudentsTab } from "@/components/parents/relationship/LinkedStudentsTab"
import { PendingRequestsTab } from "@/components/parents/relationship/PendingRequestsTab"
import { SendRequestTab } from "@/components/parents/relationship/SendRequestTab"
import { menuImages } from "@/constants/images"
import Image from "next/image"

export default function ParentRelationshipPage() {
  const page = useParentPage({ requireStudents: false })
  const { accessToken } = useRequestInfo()
  const [activeTab, setActiveTab] = useState("linked")
  const { linkedStudentsCount, pendingRequestsCount } = useParentRelationship(accessToken)

  // Show loading/error states
  if (!page.shouldRender) {
    return page.renderState
  }

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Header Section */}
      <div className="relative bg-gradient-to-br from-[#25AAE1] via-[#1D8CB3] to-[#1453B8] p-8 rounded-3xl text-white shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Link2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    Student Relationships
                    {/* <Sparkles className="w-6 h-6 text-yellow-300" /> */}
                  </h1>
                  <p className="text-blue-100 text-base mt-1">
                    Connect with students and manage your network
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3">
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 text-center min-w-[100px]">
                <div className="text-2xl font-bold">{linkedStudentsCount}</div>
                <div className="text-xs text-blue-100 mt-1">Linked</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 text-center min-w-[100px]">
                <div className="text-2xl font-bold">{pendingRequestsCount}</div>
                <div className="text-xs text-blue-100 mt-1">Pending</div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-400/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-100" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Active Connections</p>
                  <p className="text-lg font-semibold">View & manage linked students</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-100" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Waiting for Response</p>
                  <p className="text-lg font-semibold">Track pending requests</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-400/30 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-purple-100" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Expand Network</p>
                  <p className="text-lg font-semibold">Send new link requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs Card */}
      <Card className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 px-6">
            <TabsList className="bg-transparent h-auto p-0 w-full justify-start gap-2">
              <TabsTrigger
                value="linked"
                className="relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#25AAE1] data-[state=active]:to-[#1D8CB3] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-t-xl px-6 py-4 gap-2 font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                <Users className="h-5 w-5" />
                <span>Linked Students</span>
                {linkedStudentsCount > 0 && (
                  <Badge className="ml-2 bg-white/30 text-white border-0 data-[state=active]:bg-white/30">
                    {linkedStudentsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#25AAE1] data-[state=active]:to-[#1D8CB3] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-t-xl px-6 py-4 gap-2 font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                <Clock className="h-5 w-5" />
                <span>Pending Requests</span>
                {pendingRequestsCount > 0 && (
                  <Badge className="ml-2 bg-white/30 text-white border-0 data-[state=active]:bg-white/30">
                    {pendingRequestsCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="send"
                className="relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#25AAE1] data-[state=active]:to-[#1D8CB3] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-t-xl px-6 py-4 gap-2 font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                <UserPlus className="h-5 w-5" />
                <span>Send Request</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-8">
            <TabsContent value="linked" className="mt-0">
              <LinkedStudentsTab accessToken={accessToken || ""} />
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <PendingRequestsTab accessToken={accessToken || ""} />
            </TabsContent>

            <TabsContent value="send" className="mt-0">
              <SendRequestTab accessToken={accessToken || ""} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
