"use client";

import { useState, useEffect, useCallback } from "react";
import { getLinkedParents, getPendingParentLinks, getMyUnlinkRequests } from "@/services/parent-service";

export interface LinkedParent {
  relation_id: number;
  parent_id: number;
  parent_user_id: number;
  parent_full_name: string;
}

export interface PendingParentLink {
  relation_id?: number;
  parent_id: number;
  parent_user_id: number;
  parent_full_name: string;
  requested_at?: string;
}

export interface UnlinkRequest {
  id: number;
  student: number;
  parent: number;
  approved: boolean;
  created_at: string | null;
  approved_at: string | null;
  student_name: string;
  parent_name: string;
}

interface UseParentsOptions {
  includePendingRequests?: boolean;
  includeUnlinkRequests?: boolean;
}

export function useParents(
  options: UseParentsOptions = {},
  accessToken?: string,
  tenantDomain?: string
) {
  const [linkedParents, setLinkedParents] = useState<LinkedParent[]>([]);
  const [pendingLinks, setPendingLinks] = useState<PendingParentLink[]>([]);
  const [unlinkRequests, setUnlinkRequests] = useState<UnlinkRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { includePendingRequests = false, includeUnlinkRequests = false } = options;

  const fetchData = useCallback(async () => {
    if (!accessToken || !tenantDomain) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parentsData = await getLinkedParents(tenantDomain, accessToken);
      // Handle both paginated response and direct array
      const linkedData = parentsData?.results || parentsData;
      setLinkedParents(Array.isArray(linkedData) ? linkedData : []);

      if (includePendingRequests) {
        try {
          const pendingData = await getPendingParentLinks(tenantDomain, accessToken);
          // Handle both paginated response and direct array
          const pendingArray = pendingData?.results || pendingData;
          setPendingLinks(Array.isArray(pendingArray) ? pendingArray : []);
        } catch (pendingError) {
          console.warn("Could not fetch pending links:", pendingError);
          setPendingLinks([]);
        }
      }

      if (includeUnlinkRequests) {
        try {
          const unlinkData = await getMyUnlinkRequests(tenantDomain, accessToken);
          // Handle both paginated response and direct array
          const unlinkArray = unlinkData?.results || unlinkData;
          setUnlinkRequests(Array.isArray(unlinkArray) ? unlinkArray : []);
        } catch (unlinkError) {
          console.warn("Could not fetch unlink requests:", unlinkError);
          setUnlinkRequests([]);
        }
      }
    } catch (err: any) {
      console.error("Error fetching parents data:", err);
      setError(err.message || "Failed to fetch parents data");
    } finally {
      setLoading(false);
    }
  }, [accessToken, tenantDomain, includePendingRequests, includeUnlinkRequests]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    linkedParents,
    pendingLinks,
    unlinkRequests,
    loading,
    error,
    refetch,
    clearError,
  };
}