"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  fetchParents,
  validateParent,
  deleteParent,
  Parent
} from "@/services/ParentAdminApiClient";
import { useRequestInfo } from "@/hooks/useRequestInfo";

export default function AdminParentTable() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const { tenantDomain, accessToken } = useRequestInfo();

  const loadParents = async () => {
    if (!tenantDomain || !accessToken) return;
    try {
      const data = await fetchParents(tenantDomain, accessToken, page);
      setParents(data);
    } catch (error) {
      console.error("Erreur chargement parents:", error);
    }
  };

  const handleValidate = async (id: number) => {
    await validateParent(tenantDomain, accessToken, id);
    loadParents();
  };

  const handleDelete = async (id: number) => {
    await deleteParent(tenantDomain, accessToken, id);
    loadParents();
  };

  useEffect(() => {
    loadParents();
  }, [page]);

  const filtered = parents.filter((p) =>
    p.user.full_name.toLowerCase().includes(filter.toLowerCase())
  );

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
        {filtered.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.user.full_name}</TableCell>
            <TableCell>{p.user.email}</TableCell>
            <TableCell className="space-x-2">
              {!p.user.is_active && (
                <Button size="sm" onClick={() => handleValidate(p.id)}>
                  Valider
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(p.id)}
              >
                Supprimer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
