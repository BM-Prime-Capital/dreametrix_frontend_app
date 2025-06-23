import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [show, setShow] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchData()

    const socket = new WebSocket("ws://localhost:8000/ws/notifications/")
    socket.onmessage = (e) => {
      const notif = JSON.parse(e.data)
      setNotifications((prev) => [notif, ...prev])
    }

    return () => socket.close()
  }, [])

  const fetchData = async () => {
    const res = await axios.get("/notifications/")
    setNotifications(res.data)
  }

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener("mousedown", clickOutside)
    return () => document.removeEventListener("mousedown", clickOutside)
  }, [])

  const markAllAsRead = async () => {
    await axios.post("/notifications/read_all/")
    fetchData()
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="ghost" onClick={() => setShow(!show)}>
        <Bell />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </Button>

      {show && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded p-2 z-50">
          <div className="flex justify-between items-center mb-2">
            <strong>Notifications</strong>
            <Button variant="link" onClick={markAllAsRead} className="text-xs p-0">Tout lu</Button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted">Aucune notification</p>
          ) : (
            notifications.slice(0, 5).map(n => (
              <div key={n.id} className="border-b last:border-0 py-1 text-sm">
                <div>{n.message}</div>
                <div className="text-xs text-muted">{new Date(n.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
