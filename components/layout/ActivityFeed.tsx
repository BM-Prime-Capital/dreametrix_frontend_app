"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, FileText, MessageSquare, Pencil } from "lucide-react"

const activities = [
  {
    id: 1,
    user: "Darika Samak",
    action: "Mark as done",
    subject: "Listing on Science",
    time: "8:40 PM",
    icon: Check,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    id: 2,
    user: "Emilee Simchenko",
    action: "Sent you a message",
    time: "7:32 PM",
    icon: MessageSquare,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
  {
    id: 3,
    user: "Darika Samak",
    action: "uploaded 4 files on",
    subject: "Tasks3 - Mathematics",
    time: "6:02 PM",
    icon: FileText,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
]

export function ActivityFeed() {
  return (
    <div className="p-6">
      <h2 className="font-semibold mb-4">Activity</h2>
      <div className="text-xs text-gray-500 mb-4">TODAY</div>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 relative">
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full ${activity.iconBg}`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              {activity.id !== activities.length && (
                <div className="w-px h-full bg-gray-200 absolute top-8" />
              )}
            </div>
            <div>
              <p className="text-sm">
                <span className="font-semibold">{activity.user}</span>{" "}
                {activity.action}{" "}
                {activity.subject && (
                  <span className="font-semibold">{activity.subject}</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}