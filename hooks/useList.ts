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
          const data = paramsObj
            ? await getList(tenantDomain, accessToken, refreshToken, paramsObj)
            : await getList(tenantDomain, accessToken, refreshToken);

          setList(data);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      loadList();
    }
  }, [tenantDomain]);

  return { list, isLoading, error };
}
