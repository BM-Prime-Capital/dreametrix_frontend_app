"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

const getNotifications = async () => {
  const res = await axios.get("/notifications/")
  return res.data.results
}

const markAllAsRead = async () => {
  await axios.post("/notifications/mark_all_as_read/")
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const data = await getNotifications()
      setNotifications(data)
    }
    fetch()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

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
            onClick={async () => {
              await markAllAsRead()
              const data = await getNotifications()
              setNotifications(data)
            }}
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
            <DropdownMenuItem key={n.id} className={`text-sm ${n.read ? "opacity-50" : ""}`}>
              {n.message}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
