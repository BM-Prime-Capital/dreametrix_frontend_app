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
      setMessage("Lien confirmé.")
    } catch {
      setMessage("Erreur lors de la confirmation.")
    }
  }

  const handleUnlink = async () => {
    try {
      await requestUnlink(Number(unlinkParentId))
      setMessage("Demande de déliaison envoyée.")
    } catch {
      setMessage("Erreur lors de la demande.")
    }
  }

  return (
    <div className="space-y-6 p-4 rounded-lg border bg-white shadow-md">
      <h2 className="text-lg font-semibold text-gray-800">Espace Élève : Lien Parental</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirmer un lien parental</label>
        <input
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="ID du parent"
        />
        <Button onClick={handleConfirm}>Confirmer le lien</Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Demander une déliaison</label>
        <input
          value={unlinkParentId}
          onChange={(e) => setUnlinkParentId(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="ID du parent à délier"
        />
        <Button onClick={handleUnlink} variant="destructive">Demander déliaison</Button>
      </div>

      {message && <div className="text-green-600 text-sm">{message}</div>}
    </div>
  )
}
