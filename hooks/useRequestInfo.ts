"use client";

import { localStorageKey } from "@/constants/global";
import { useEffect, useState, useMemo } from "react";

export function useRequestInfo() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [tenantDomain, setTenantDomain] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const accessToken =
          localStorage.getItem(localStorageKey.ACCESS_TOKEN) || "";
        const refreshToken =
          localStorage.getItem(localStorageKey.REFRESH_TOKEN) || "";
        const tenantData = localStorage.getItem(localStorageKey.TENANT_DATA);

        let domain = "";
        if (tenantData) {
          const parsedData = JSON.parse(tenantData);
          domain = parsedData.primary_domain
            ? `https://${parsedData.primary_domain}`
            : "";
        }

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setTenantDomain(domain);
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    }
  }, []);

  return useMemo(
    () => ({
      accessToken,
      refreshToken,
      tenantDomain,
    }),
    [accessToken, refreshToken, tenantDomain]
  );
}
