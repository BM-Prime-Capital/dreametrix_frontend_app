"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getNotifications, markNotificationAsRead, Notification } from "@/services/NotificationApiServices"

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getNotifications()
        setNotifications(data)
      } catch (error) {
        console.error("Erreur lors du chargement des notifications :", error)
      }
    }
    fetch()
  }, [])

  const markAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error("Erreur lors du marquage comme lu :", error)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Toutes vos notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-muted">Aucune notification</p>
      ) : (
        notifications.map(n => (
          <div
            key={n.id}
            className={`border p-3 rounded mb-2 ${n.read ? "opacity-50" : "bg-yellow-50"}`}
          >
            <div className="text-sm">{n.message}</div>
            <div className="text-xs text-muted">
              {new Date(n.created_at).toLocaleString()}
            </div>
            {!n.read && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAsRead(n.id)}
                className="mt-2"
              >
                Marquer comme lu
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  )
}
