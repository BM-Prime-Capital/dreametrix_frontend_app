// /student/DashboardStudent.tsx
"use client"
import { useState } from "react"
import { confirmLink, requestUnlink } from "@/lib/api/student"
import { Button } from "@/components/ui/button"

export default function DashboardStudent() {
  const [parentId, setParentId] = useState("")
  const [unlinkParentId, setUnlinkParentId] = useState("")
  const [message, setMessage] = useState("")

  const handleConfirm = async () => {
    try {
      await confirmLink(Number(parentId))
      setMessage("Link confirmed successfully.")
    } catch {
      setMessage("Error confirming link.")
    }
  }

  const handleUnlink = async () => {
    try {
      await requestUnlink(Number(unlinkParentId))
      setMessage("Unlink request sent successfully.")
    } catch {
      setMessage("Error sending unlink request.")
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">Student Dashboard</h2>

      <div className="space-y-2">
        <h3>Confirm Parental Link</h3>
        <input
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="border p-2 w-full"
          placeholder="Parent ID"
        />
        <Button onClick={handleConfirm}>Confirm Link</Button>
      </div>

      <div className="space-y-2">
        <h3>Request Unlink</h3>
        <input
          value={unlinkParentId}
          onChange={(e) => setUnlinkParentId(e.target.value)}
          className="border p-2 w-full"
          placeholder="Parent ID to unlink"
        />
        <Button onClick={handleUnlink}>Request Unlink</Button>
      </div>

      {message && <div className="text-green-600 text-sm">{message}</div>}
    </div>
  )
}