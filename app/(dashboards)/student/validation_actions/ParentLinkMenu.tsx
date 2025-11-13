"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { confirmLink, requestUnlink } from "@/services/students/student"

export default function ParentLinkMenu() {
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
    <div className="space-y-6 p-4 rounded-lg border bg-white shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">Student Space: Parental Link</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm Parental Link</label>
        <input
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Parent ID"
        />
        <Button onClick={handleConfirm}>Confirm Link</Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Request Unlink</label>
        <input
          value={unlinkParentId}
          onChange={(e) => setUnlinkParentId(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Parent ID to unlink"
        />
        <Button onClick={handleUnlink} variant="destructive">Request Unlink</Button>
      </div>

      {message && <div className="text-green-600 text-sm">{message}</div>}
    </div>
  )
}