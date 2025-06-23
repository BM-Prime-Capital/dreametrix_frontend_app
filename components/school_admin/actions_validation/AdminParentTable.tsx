import { useEffect, useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function AdminParentTable() {
  const [parents, setParents] = useState<any[]>([])
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)

  const fetchData = async () => {
    const res = await axios.get(`/parents/?page=${page}`)
    setParents(res.data.results)
  }

  const validate = async (id: number) => {
    await axios.post(`/parents/validate/${id}/`)
    fetchData()
  }

  const remove = async (id: number) => {
    await axios.delete(`/parents/${id}/`)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const filtered = parents.filter(p =>
    p.user.full_name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Liste des Parents</h2>
      <Input
        placeholder="Filtrer par nom/email"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        {filtered.map(p => (
          <TableRow key={p.id}>
            <TableCell>{p.user.full_name}</TableCell>
            <TableCell>{p.user.email}</TableCell>
            <TableCell className="space-x-2">
              {!p.user.is_active && (
                <Button size="sm" onClick={() => validate(p.id)}>Valider</Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => remove(p.id)}>Supprimer</Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  )
}
