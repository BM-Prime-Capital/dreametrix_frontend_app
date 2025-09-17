"use client";

import { useState, useEffect, useCallback } from "react";
import { getLinkedParents, getPendingParentLinks } from "@/services/parent-service";

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

interface UseParentsOptions {
  includePendingRequests?: boolean;
}

export function useParents(
  options: UseParentsOptions = {},
  accessToken?: string,
  tenantDomain?: string
) {
  const [linkedParents, setLinkedParents] = useState<LinkedParent[]>([]);
  const [pendingLinks, setPendingLinks] = useState<PendingParentLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { includePendingRequests = false } = options;

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
    } catch (err: any) {
      console.error("Error fetching parents data:", err);
      setError(err.message || "Failed to fetch parents data");
    } finally {
      setLoading(false);
    }
  }, [accessToken, tenantDomain, includePendingRequests]);

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
    loading,
    error,
    refetch,
    clearError,
  };
}