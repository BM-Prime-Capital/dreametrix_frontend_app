"use client";

import { useEffect, useState } from "react";
import { useRequestInfo } from "./useRequestInfo";

export function useList(getList: Function, paramsObj?: any) {
  const [list, setList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { accessToken, refreshToken, tenantDomain } = useRequestInfo();

  useEffect(() => {
    if (accessToken && refreshToken && tenantDomain) {
      const loadList = async () => {
        try {
          setIsLoading(true);
          const data = paramsObj
            ? await getList(tenantDomain, accessToken, refreshToken, paramsObj)
            : await getList(tenantDomain, accessToken, refreshToken);

          console.log("API Response:", data); // Log de la réponse de l'API
          
          setList(data);
        } catch (error: any) {
          console.error("API Error:", error); // Log de l'erreur
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      loadList();
    }
  }, [tenantDomain, accessToken, refreshToken, paramsObj, getList]);

  return { list, isLoading, error };
}