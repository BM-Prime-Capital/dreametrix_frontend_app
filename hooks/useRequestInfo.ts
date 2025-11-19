"use client";

import { localStorageKey } from "@/constants/global";
import { useEffect, useState, useMemo } from "react";

function useRequestInfo() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [tenantDomain, setTenantDomain] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const accessToken =
          localStorage.getItem(localStorageKey.ACCESS_TOKEN) || "";
        const refreshToken =
          localStorage.getItem(localStorageKey.REFRESH_TOKEN) || "";
        const tenantData = localStorage.getItem(localStorageKey.TENANT_DATA);
        const userData = localStorage.getItem(localStorageKey.USER_DATA);

        let domain = "";
        let userIdValue = "";
        
        if (tenantData) {
          const parsedData = JSON.parse(tenantData);
          domain =`${(parsedData.primary_domain.startsWith('http') ?  parsedData.primary_domain : `https://${parsedData.primary_domain}`)}`
          
         
        }

        if (userData) {
          const parsedUserData = JSON.parse(userData);
          userIdValue = parsedUserData.id?.toString() || "";
        }

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setTenantDomain(domain);
        setUserId(userIdValue);
        setIsLoading(false);
        
        // Debug logging
        console.log("useRequestInfo - Token loaded:", {
          hasToken: !!accessToken,
          tokenLength: accessToken.length,
          hasDomain: !!domain,
          hasUserId: !!userIdValue
        });
        
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        setIsLoading(false);
      }
    }
  }, []);

  return useMemo(
    () => ({
      accessToken,
      refreshToken,
      tenantDomain,
      userId,
      isLoading,
    }),
    [accessToken, refreshToken, tenantDomain, userId, isLoading]
  );
}

export { useRequestInfo };
export default useRequestInfo;
