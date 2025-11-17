/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { localStorageKey } from "@/constants/global";
import { useEffect, useState, useMemo } from "react";

export function useRequestInfo() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [tenantDomain, setTenantDomain] = useState<string>("");
  const [schoolData, setSchoolData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");


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
        let schoolData = null;
        let userIdValue = "";
        
        if (tenantData) {
          const parsedData = JSON.parse(tenantData);
          domain = parsedData.primary_domain
            ? `https://${parsedData.primary_domain}`
            : "";
          schoolData = parsedData; 
        }

        if (userData) {
          const parsedUserData = JSON.parse(userData);
          userIdValue = parsedUserData.id?.toString() || "";
        }

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setTenantDomain(domain);
        setSchoolData(schoolData); 
        setUserId(userIdValue);
        setIsLoading(false);
        
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
      schoolData,
      userId,
      isLoading,
    }),
    [accessToken, refreshToken, tenantDomain, schoolData,userId, isLoading]
  );
}