"use client";

import { localStorageKey } from "@/constants/global";
import { useEffect, useState } from "react";

export function useRequestInfo() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [tenantDomain, setTenantDomain] = useState<string>("");

  const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);

  useEffect(() => {
    const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
    const refreshToken: any = localStorage.getItem(
      localStorageKey.REFRESH_TOKEN
    );

    const { primary_domain } = JSON.parse(tenantData);

    const domain = `https://${primary_domain}`;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setTenantDomain(domain);
  }, [tenantData]);

  const data = {
    accessToken,
    refreshToken,
    tenantDomain,
  };

  return data;
}
