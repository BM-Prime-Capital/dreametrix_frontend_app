"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import {
  getNotifications,
  markAllAsRead,
  type Notification
} from "@/services/NotificationApiServices"
import { useRequestInfo } from "@/hooks/useRequestInfo"

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { tenantDomain, accessToken } = useRequestInfo()

  useEffect(() => {
    const fetch = async () => {
      if (tenantDomain && accessToken) {
        const data = await getNotifications(tenantDomain, accessToken)
        setNotifications(data)
      }
    }
    fetch()
  }, [tenantDomain, accessToken])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllAsRead = async () => {
    if (tenantDomain && accessToken) {
      await markAllAsRead(tenantDomain, accessToken)
      const updated = await getNotifications(tenantDomain, accessToken)
      setNotifications(updated)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-auto">
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
            onClick={handleMarkAllAsRead}
          >
            Marquer tout comme lu
          </Button>
        </DropdownMenuItem>
        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-muted text-sm">
            Aucune notification
          </DropdownMenuItem>
        ) : (
          notifications.map(n => (
            <DropdownMenuItem
              key={n.id}
              className={`text-sm ${n.read ? "opacity-50" : ""}`}
            >
              {n.message}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
