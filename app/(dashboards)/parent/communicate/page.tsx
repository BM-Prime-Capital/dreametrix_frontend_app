"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ParentMessageList } from "@/components/parents/communicate/parent-message-list"
import { ParentComposeDialog } from "@/components/parents/communicate/parent-compose-dialog"
import { MessageCircle, Users, UserPlus } from 'lucide-react'

export default function ParentCommunicatePage() {
  const [activeTab, setActiveTab] = useState<"teachers" | "school-admin" | "other-parents">("teachers")
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null)

  const handleMessageClick = (messageId: number) => {
    setSelectedMessageId(messageId === selectedMessageId ? null : messageId)
  }

  return (
    <section className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[#25AAE1] text-xl font-bold">COMMUNICATE</h1>
      </div>

      <div className="flex gap-4">
        <button
          className="bg-[#25AAE1] text-white px-6 py-3 rounded-md flex items-center gap-2"
          onClick={() => setIsComposeOpen(true)}
        >
          <MessageCircle className="h-5 w-5" />
          <span>Compose</span>
        </button>
      </div>

      <div className="flex">
        <button
          className={`flex-1 py-4 flex flex-col items-center ${
            activeTab === "teachers" ? "bg-[#E3F2F9]" : "bg-[#F0F7FA]"
          }`}
          onClick={() => setActiveTab("teachers")}
        >
          <Users className="h-5 w-5 text-[#25AAE1] mb-1" />
          <span className="text-gray-700 font-medium">TEACHERS</span>
        </button>
        <button
          className={`flex-1 py-4 flex flex-col items-center ${
            activeTab === "school-admin" ? "bg-[#E3F2F9]" : "bg-white"
          }`}
          onClick={() => setActiveTab("school-admin")}
        >
          <UserPlus className="h-5 w-5 text-[#25AAE1] mb-1" />
          <span className="text-gray-700 font-medium">SCHOOL ADMIN</span>
        </button>
        <button
          className={`flex-1 py-4 flex flex-col items-center ${
            activeTab === "other-parents" ? "bg-[#E3F2F9]" : "bg-[#F0F7FA]"
          }`}
          onClick={() => setActiveTab("other-parents")}
        >
          <Users className="h-5 w-5 text-[#25AAE1] mb-1" />
          <span className="text-gray-700 font-medium">OTHER PARENTS</span>
        </button>
      </div>

      <Card className="rounded-lg shadow-sm p-0 overflow-hidden border-0">
        <ParentMessageList
          activeTab={activeTab}
          selectedMessageId={selectedMessageId}
          onMessageClick={handleMessageClick}
        />
      </Card>

      <ParentComposeDialog isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
    </section>
  )
}
