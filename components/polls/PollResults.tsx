"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { fetchPollResults, QuestionResult } from "./api";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#f87171", "#06b6d4", "#a78bfa", "#f97316"];

type PollResultsProps = {
  pollId: number;
  domain: string;
  token: string;
  onBack: () => void;
};

export function PollResults({ pollId, domain, token, onBack }: PollResultsProps) {
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPollResults(domain, token, pollId);
        setResults(data);
      } catch (error) {
        console.error("Error loading results", error);
      } finally {
        setLoading(false);
      }
    };

    if (pollId && domain && token) fetchData();
  }, [pollId, domain, token]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-[200px]" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-[200px] w-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onBack}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Poll Results</h1>
      </div>

      {results.map((question, index) => (
        <Card key={question.id} className="p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold">
            {index + 1}. {question.text}
          </h2>

          {(["single", "multiple"].includes(question.type) && question.choices) && (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={question.choices}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="label" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" name="Responses">
                    {question.choices.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {question.type === "text" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {question.response_count} text response(s)
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                {question.responses?.map((resp, i) => (
                  <div key={i} className="py-2 border-b last:border-b-0">
                    <p className="text-gray-700">{resp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}