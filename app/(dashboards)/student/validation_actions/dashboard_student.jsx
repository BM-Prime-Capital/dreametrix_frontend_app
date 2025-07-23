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
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">Espace Élève</h2>

      <div className="space-y-2">
        <h3>Confirmer un lien parental</h3>
        <input
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="border p-2 w-full"
          placeholder="ID du parent"
        />
        <Button onClick={handleConfirm}>Confirmer le lien</Button>
      </div>

      <div className="space-y-2">
        <h3>Demander une déliaison</h3>
        <input
          value={unlinkParentId}
          onChange={(e) => setUnlinkParentId(e.target.value)}
          className="border p-2 w-full"
          placeholder="ID du parent à délier"
        />
        <Button onClick={handleUnlink}>Demander déliaison</Button>
      </div>

      {message && <div className="text-green-600 text-sm">{message}</div>}
    </div>
  )
}
