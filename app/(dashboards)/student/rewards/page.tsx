"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RewardsDashboard } from "../../../../components/student/rewards/rewards-dashboard"

export default function RewardsPage() {
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
              REWARDS
            </h1>
            <p className="text-white/80 text-sm">Manage your points and rewards</p>
          </div>
        </div>
      </div>

      <RewardsDashboard />
    </div>
  )
}

