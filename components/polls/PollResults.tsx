"use client";

import { useEffect, useState } from "react";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { Card } from "@/components/ui/card";
import { fetchPollResults, QuestionResult } from "./api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Share2, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Palette de couleurs basée sur votre bleu #3E81D4
const BLUE_PALETTE = {
  primary: "#3E81D4",
  light: "#6BA1E0",
  dark: "#2C62B0",
  accent: "#4D9AFF",
  background: "#F0F7FF"
};

const COLORS = [
  BLUE_PALETTE.primary,
  BLUE_PALETTE.light,
  BLUE_PALETTE.dark,
  BLUE_PALETTE.accent,
  "#82ca9d",
  "#ffc658",
  "#a78bfa"
];

type PollResultsProps = {
  pollId: number;
  domain: string;
  token: string;
  onBack: () => void;
};

export function PollResults({ pollId, domain, token, onBack }: PollResultsProps) {
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

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

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await fetchPollResults(domain, token, pollId);
      setResults(data);
    } catch (error) {
      console.error("Error refreshing results", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = activeTab === "all" 
    ? results 
    : results.filter(q => q.type === activeTab);

  if (loading) {
    return (
      <div className="w-full h-full p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
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

  // Données pour le graphique radar (synthèse)
  const radarData = results
    .filter(q => ["single", "multiple"].includes(q.type))
    .map((q, i) => ({
      subject: q.text.length > 15 ? `${q.text.substring(0, 15)}...` : q.text,
      A: q.choices?.reduce((acc, curr) => acc + curr.count, 0) || 0,
      fullMark: Math.max(...(q.choices?.map(c => c.count) || [0])) * 1.5
    }));

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Poll Analysis Dashboard</h1>
            <p className="text-blue-600">Detailed results and insights</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={refreshData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white rounded-xl shadow-xs border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Questions</p>
              <h3 className="text-3xl font-bold mt-1">{results.length}</h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white rounded-xl shadow-xs border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Multiple Choice</p>
              <h3 className="text-3xl font-bold mt-1 text-blue-600">
                {results.filter(q => ["single", "multiple"].includes(q.type)).length}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white rounded-xl shadow-xs border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Text Responses</p>
              <h3 className="text-3xl font-bold mt-1 text-blue-600">
                {results.filter(q => q.type === "text").length}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Radar Chart Overview */}
      {radarData.length > 0 && (
        <Card className="p-6 mb-8 bg-white rounded-xl shadow-xs border-0">
          <h2 className="text-lg font-semibold mb-4">Question Engagement Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 10']} />
                <Radar 
                  name="Responses" 
                  dataKey="A" 
                  stroke={BLUE_PALETTE.primary} 
                  fill={BLUE_PALETTE.primary} 
                  fillOpacity={0.6} 
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("all")}
        >
          All Questions
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "single" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("single")}
        >
          Single Choice
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "multiple" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("multiple")}
        >
          Multiple Choice
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "text" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("text")}
        >
          Text Responses
        </button>
      </div>

      {/* Questions Results */}
      <div className="space-y-8">
        {filteredResults.map((question, index) => (
          <Card key={question.id} className="p-6 bg-white rounded-xl shadow-xs border-0">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">
                <span className="text-blue-600">Q{index + 1}:</span> {question.text}
              </h2>
              <Badge variant="outline" className="border-blue-200 text-blue-600">
                {question.type.toUpperCase()}
              </Badge>
            </div>

            {(["single", "multiple"].includes(question.type) && question.choices) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={question.choices}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis type="number" stroke="#888" />
                      <YAxis 
                        dataKey="label" 
                        type="category" 
                        width={100} 
                        stroke="#888" 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderColor: BLUE_PALETTE.primary,
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar dataKey="count" name="Responses" radius={[0, 4, 4, 0]}>
                        {question.choices.map((_, idx) => (
                          <Cell 
                            key={idx} 
                            fill={COLORS[idx % COLORS.length]} 
                            strokeWidth={0}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={question.choices}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="label"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {question.choices.map((_, idx) => (
                          <Cell 
                            key={idx} 
                            fill={COLORS[idx % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderColor: BLUE_PALETTE.primary,
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {question.type === "text" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {question.response_count} text response(s)
                  </p>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    Analyze Sentiment
                  </Button>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  {question.responses?.map((resp, i) => (
                    <Card key={i} className="p-3 mb-2 bg-white">
                      <p className="text-gray-700">{resp}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}