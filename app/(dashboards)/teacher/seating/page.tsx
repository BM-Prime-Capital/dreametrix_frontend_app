"use client";
import Seating from "@/components/seating/Seating";
import { useRequestInfo } from "@/hooks/useRequestInfo";


export default function SeatingPage() {
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  
  if (!accessToken || !tenantDomain) {
    return <div>Loading...</div>;
  }

  return (
    <Seating 
      tenantPrimaryDomain={tenantDomain}
      accessToken={accessToken} 
      refreshToken={refreshToken} 
      courses={[]} 
    />
  );
}