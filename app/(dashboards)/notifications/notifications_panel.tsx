"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"

const getNotifications = async () => {
  const res = await axios.get("/notifications/")
  return res.data.results
}

const markNotificationAsRead = async (id: number) => {
  await axios.post(`/notifications/${id}/mark_as_read/`)
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const data = await getNotifications()
      setNotifications(data)
    }
    fetch()
  }, [])

  const markAsRead = async (id: number) => {
    await markNotificationAsRead(id)
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Toutes vos notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-muted">Aucune notification</p>
      ) : (
        notifications.map(n => (
          <div key={n.id} className={`border p-3 rounded mb-2 ${n.read ? "opacity-50" : "bg-yellow-50"}`}>
            <div className="text-sm">{n.message}</div>
            <div className="text-xs text-muted">{new Date(n.created_at).toLocaleString()}</div>
            {!n.read && (
              <Button variant="outline" size="sm" onClick={() => markAsRead(n.id)} className="mt-2">
                Marquer comme lu
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  )
}
