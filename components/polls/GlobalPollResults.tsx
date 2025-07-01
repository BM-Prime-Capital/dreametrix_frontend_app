"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { ChevronLeft, Download, FileText, FileSpreadsheet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getGlobalResults } from "./api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { PollBlock } from "./types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Course {
  id: number;
  name: string;
}

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe", "#eff6ff"];

type GlobalPollResultsProps = {
  onBack: () => void;
};

export default function GlobalPollResults({ onBack }: GlobalPollResultsProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState<PollBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const { tenantDomain, accessToken } = useRequestInfo();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadCourses = () => {
      try {
        const savedCourses = localStorage.getItem("classes");
        if (savedCourses) {
          const parsedCourses: Course[] = JSON.parse(savedCourses);
          setCourses(parsedCourses);
        }
      } catch (error) {
        console.error("Failed to load courses", error);
        toast.error("Failed to load courses data");
      }
    };

    loadCourses();
  }, [open]);

  const handleLoad = async () => {
    if (!courseId || !tenantDomain || !accessToken) {
      toast.warning("Please select a course");
      return;
    }

    setLoading(true);
    try {
      const data = await getGlobalResults(
        tenantDomain,
        accessToken,
        courseId,
        fromDate || undefined,
        toDate || undefined
      );
      setResults(data);
    } catch (error) {
      console.error("Error loading results:", error);
      toast.error("Failed to load results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (results.length === 0) return;

    const wb = XLSX.utils.book_new();
    results.forEach((poll) => {
      const sheetData: any[][] = [["Question", "Type", "Response", "Count", "Percentage"]];

      poll.questions.forEach((question) => {
        if (question.type === "text" && question.responses) {
          question.responses.forEach((response) => {
            sheetData.push([question.text, question.type, response, "-", "-"]);
          });
        } else if (question.choices) {
          question.choices.forEach((choice) => {
            sheetData.push([question.text, question.type, choice.label, choice.count, `${choice.percentage}%`]);
          });
        }
      });

      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, poll.poll_title.slice(0, 30));
    });

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "poll_results.xlsx");
    toast.success("Excel file exported successfully");
  };

  const exportToPDF = async () => {
    if (results.length === 0) return;

    const input = document.getElementById("poll-results-section");
    if (!input) return;

    try {
      toast.info("Generating PDF...");
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      while (position < imgHeight) {
        if (position > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
        position += pdf.internal.pageSize.getHeight();
      }

      pdf.save("poll_results.pdf");
      toast.success("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="rounded-full bg-white shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Global Poll Results</h1>
              <p className="text-sm text-blue-600">Analyze and export poll responses</p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              onClick={exportToExcel}
              disabled={loading || results.length === 0}
              variant="outline"
              className="bg-white text-blue-600 hover:bg-blue-50 border-blue-200 gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">Excel</span>
            </Button>
            <Button
              onClick={exportToPDF}
              disabled={loading || results.length === 0}
              variant="outline"
              className="bg-white text-blue-600 hover:bg-blue-50 border-blue-200 gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="p-6 rounded-xl border-0 bg-white shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Course select */}
            <div className="space-y-1">
              <Label htmlFor="course" className="text-sm font-medium text-blue-800">Course</Label>
              <select
                id="course"
                value={courseId || ""}
                onChange={(e) => setCourseId(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-blue-100 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-blue-900"
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* From Date */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-blue-800">From</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                disabled={loading}
                className="border-blue-100 bg-blue-50 focus:ring-blue-300"
              />
            </div>

            {/* To Date */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-blue-800">To</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                disabled={loading}
                className="border-blue-100 bg-blue-50 focus:ring-blue-300"
              />
            </div>

            {/* Load button */}
            <div className="flex items-end">
              <Button
                onClick={handleLoad}
                disabled={loading || !courseId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-[42px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Load Results"
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 bg-white rounded-xl shadow-sm">
                <Skeleton className="h-8 w-1/3 mb-6" />
                <Skeleton className="h-64 w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <div id="poll-results-section" className="space-y-8">
            {results.length === 0 ? (
              <Card className="p-12 text-center bg-white rounded-xl shadow-sm">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="text-xl font-medium text-blue-800">No results found</h3>
                  <p className="text-blue-600">Select a course and date range to view poll results</p>
                </div>
              </Card>
            ) : (
              results.map((poll) => (
                <Card key={poll.poll_id} className="p-6 bg-white rounded-xl shadow-sm border-0">
                  <h2 className="text-xl font-semibold text-blue-800 border-b border-blue-100 pb-3 mb-6">{poll.poll_title}</h2>
                  <div className="space-y-10">
                    {poll.questions.map((question) => (
                      <div key={question.id} className="space-y-4">
                        <h3 className="text-lg font-medium text-blue-900">{question.text}</h3>

                        {question.type !== "text" && question.choices && (
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={question.choices}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                                <XAxis type="number" stroke="#64748b" />
                                <YAxis 
                                  dataKey="label" 
                                  type="category" 
                                  width={120} 
                                  stroke="#64748b"
                                  tick={{ fontSize: 14 }}
                                />
                                <Tooltip 
                                  contentStyle={{
                                    backgroundColor: '#ffffff',
                                    borderColor: '#e0e7ff',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                  }}
                                />
                                <Bar dataKey="count" name="Responses" radius={[0, 4, 4, 0]}>
                                  {question.choices.map((_, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={COLORS[index % COLORS.length]} 
                                      strokeWidth={0}
                                    />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}

                        {question.type === "text" && question.responses && (
                          <Card className="p-4 bg-blue-50 border-blue-100 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                                {question.responses.length} responses
                              </span>
                            </div>
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                              {question.responses.map((response, i) => (
                                <Card key={i} className="p-3 bg-white border-blue-100 rounded-md shadow-xs">
                                  <p className="text-blue-900">{response}</p>
                                </Card>
                              ))}
                            </div>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}