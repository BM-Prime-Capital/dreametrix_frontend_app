"use client";

import { useEffect, useState } from "react";
import { getRespondents, getNonRespondents } from "./api";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type Respondent = {
  id: number;
  name: string;
  email: string;
};

type PollRespondentsProps = {
  pollId: number;
  onBack: () => void;
};

export default function PollRespondents({ pollId, onBack }: PollRespondentsProps) {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [nonRespondents, setNonRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(true);
  const { tenantDomain, accessToken } = useRequestInfo();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, nr] = await Promise.all([
          getRespondents(pollId, tenantDomain, accessToken),
          getNonRespondents(pollId, tenantDomain, accessToken)
        ]);
        setRespondents(r);
        setNonRespondents(nr);
      } catch (error) {
        console.error("Error fetching respondents", error);
      } finally {
        setLoading(false);
      }
    };
    if (pollId && tenantDomain && accessToken) fetchData();
  }, [pollId, tenantDomain, accessToken]);

  if (loading) return <div className="p-4">Loading respondents...</div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onBack}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Respondents & Non-Respondents</h1>
      </div>

      <div className="space-y-8">
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center">✓</span>
            Respondents ({respondents.length})
          </h2>
          <ul className="mt-3 space-y-2">
            {respondents.map((s) => (
              <li key={s.id} className="flex items-center gap-3 p-2 hover:bg-green-100 rounded">
                <span className="font-medium">{s.name}</span>
                <span className="text-sm text-gray-500">{s.email}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center">✗</span>
            Non-Respondents ({nonRespondents.length})
          </h2>
          <ul className="mt-3 space-y-2">
            {nonRespondents.map((s) => (
              <li key={s.id} className="flex items-center gap-3 p-2 hover:bg-red-100 rounded">
                <span className="font-medium">{s.name}</span>
                <span className="text-sm text-gray-500">{s.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}