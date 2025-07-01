// /parent/DashboardParent.tsx
"use client"
import { useState } from "react"
import { linkStudent } from "@/lib/api/parents"
import { Button } from "@/components/ui/button"

export default function DashboardParent() {
  const [uuid, setUuid] = useState("")
  const [msg, setMsg] = useState("")

  const handleLink = async () => {
    try {
      await linkStudent(uuid)
      setMsg("Enfant lié avec succès.")
    } catch {
      setMsg("Erreur lors de la liaison.")
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Espace Parent</h2>

      <div>
        <input
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          className="border w-full p-2 mb-2"
          placeholder="Code UUID d'un autre enfant"
        />
        <Button onClick={handleLink}>Lier un autre enfant</Button>
      </div>

      {msg && <p className="text-green-600 text-sm">{msg}</p>}
    </div>
  )
}
