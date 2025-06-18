"use client";

import BigBrain from "@/components/big_brain/BigBrain";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import React from "react";

export default function BigBrainPage() {
  const { tenantDomain, accessToken } = useRequestInfo();

  if (!accessToken || !tenantDomain) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center p-4 gap-1">
          <video
            src="/assets/videos/general/drea_metrix_loader.mp4"
            autoPlay
            loop
            muted
            className="w-[150px] h-[150px] object-contain"
          />
          <label className="mt-0 text-sm text-slate-500">Loading data...</label>
        </div>
      </div>
    );
  }

  return <BigBrain
    accessToken={accessToken}
    tenantDomain={tenantDomain}
  />;
}
