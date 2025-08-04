"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { MessageCircle, Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommunicatePage() {
  const [activeTab, setActiveTab] = useState<"teachers" | "whole-class" | "other-groups">("teachers")

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
              COMMUNICATE
            </h1>
            <p className="text-white/80 text-sm">Connect with teachers and classmates</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">Communication Center</h2>
              <p className="text-gray-600 text-sm">Send messages and stay connected</p>
            </div>
          </div>
          
          <Button
            className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
          >
            <Send className="h-5 w-5" />
            <span className="font-semibold">Compose Message</span>
          </Button>
        </div>

        {/* Tabs avec design moderne */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex">
            <button
              className={`flex-1 py-6 flex flex-col items-center transition-all duration-300 ${activeTab === "teachers" ? "bg-gradient-to-r from-[#25AAE1]/20 to-[#1D8CB3]/20 text-[#25AAE1]" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("teachers")}
            >
              <MessageCircle className={`h-6 w-6 mb-2 transition-all duration-300 ${activeTab === "teachers" ? "text-[#25AAE1]" : "text-gray-500"}`} />
              <span className="font-semibold text-sm">TEACHERS</span>
            </button>
            <button
              className={`flex-1 py-6 flex flex-col items-center transition-all duration-300 ${activeTab === "whole-class" ? "bg-gradient-to-r from-[#25AAE1]/20 to-[#1D8CB3]/20 text-[#25AAE1]" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              onClick={() => setActiveTab("whole-class")}
            >
              <MessageCircle className={`h-6 w-6 mb-2 transition-all duration-300 ${activeTab === "whole-class" ? "text-[#25AAE1]" : "text-gray-500"}`} />
              <span className="font-semibold text-sm">WHOLE CLASS</span>
            </button>
            <button
              className={`flex-1 py-6 flex flex-col items-center transition-all duration-300 ${activeTab === "other-groups" ? "bg-gradient-to-r from-[#25AAE1]/20 to-[#1D8CB3]/20 text-[#25AAE1]" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
              onClick={() => setActiveTab("other-groups")}
            >
              <MessageCircle className={`h-6 w-6 mb-2 transition-all duration-300 ${activeTab === "other-groups" ? "text-[#25AAE1]" : "text-gray-500"}`} />
              <span className="font-semibold text-sm">OTHER GROUPS</span>
            </button>
          </div>
        </div>

        {/* Messages avec design moderne */}
        <Card className="rounded-2xl shadow-xl p-0 overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">
              {activeTab === "teachers" && "Teacher Messages"}
              {activeTab === "whole-class" && "Class Messages"}
              {activeTab === "other-groups" && "Group Messages"}
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-12">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation to see messages here</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
  

