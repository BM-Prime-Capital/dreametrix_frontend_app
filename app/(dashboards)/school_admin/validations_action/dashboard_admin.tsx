/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  fetchParents,
  fetchUnlinkRequests,
  validateParent,
  deleteParent,
  approveUnlink
} from "@/services/SchoolAdminValidation";
import { useRequestInfo } from "@/hooks/useRequestInfo";

export default function DashboardAdmin() {
  const [parents, setParents] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const { tenantDomain, accessToken } = useRequestInfo();

  const loadAll = async () => {
    if (!tenantDomain || !accessToken) return;
    const p = await fetchParents(tenantDomain, accessToken);
    const r = await fetchUnlinkRequests(tenantDomain, accessToken);
    setParents(p);
    setRequests(r);
  };

  useEffect(() => {
    loadAll();
  }, [tenantDomain, accessToken]); // relancer si l’un des deux change

  const handleValidate = async (id: number) => {
    await validateParent(tenantDomain, accessToken, id);
    loadAll();
  };

  const handleDelete = async (id: number) => {
    await deleteParent(tenantDomain, accessToken, id);
    loadAll();
  };

  const handleApproveUnlink = async (id: number) => {
    await approveUnlink(tenantDomain, accessToken, id);
    loadAll();
  };

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
                <Button onClick={() => handleValidate(parent.id)}>Valider</Button>
              )}
              <Button variant="destructive" onClick={() => handleDelete(parent.id)}>
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
            <Button onClick={() => handleApproveUnlink(req.id)}>Valider</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
