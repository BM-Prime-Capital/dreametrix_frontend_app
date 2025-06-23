"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"

export default function DashboardAdmin() {
  const [parents, setParents] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])

  const fetchParents = async () => {
    const res = await axios.get("/parents/")
    return res.data.results
  }

  const fetchUnlinkRequests = async () => {
    const res = await axios.get("/admin/unlink_requests/")
    return res.data.results
  }

  const validateParent = async (id: number) => {
    await axios.post(`/parents/validate/${id}/`)
  }

  const deleteParent = async (id: number) => {
    await axios.delete(`/parents/${id}/`)
  }

  const approveUnlink = async (id: number) => {
    await axios.post(`/admin/unlink_requests/${id}/approve/`)
  }

  const loadAll = async () => {
    const p = await fetchParents()
    const r = await fetchUnlinkRequests()
    setParents(p)
    setRequests(r)
  }

  useEffect(() => {
    loadAll()
  }, [])

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard Admin</h2>

      <h3 className="text-xl font-semibold mt-6 mb-2">Parents</h3>
      <div className="space-y-2">
        {parents.map(parent => (
          <div key={parent.id} className="border p-3 rounded flex justify-between">
            <div>
              <div>{parent.user.full_name}</div>
              <div className="text-sm text-muted">{parent.user.email}</div>
            </div>
            <div className="space-x-2">
              {!parent.user.is_active && (
                <Button onClick={() => validateParent(parent.id).then(loadAll)}>Valider</Button>
              )}
              <Button variant="destructive" onClick={() => deleteParent(parent.id).then(loadAll)}>
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Demandes de déliaison</h3>
      <div className="space-y-2">
        {requests.map(req => (
          <div key={req.id} className="border p-3 rounded flex justify-between">
            <div>
              <div>{req.student_name} ➝ {req.parent_name}</div>
              <div className="text-xs text-muted">{new Date(req.requested_at).toLocaleString()}</div>
            </div>
            <Button onClick={() => approveUnlink(req.id).then(loadAll)}>Valider</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
