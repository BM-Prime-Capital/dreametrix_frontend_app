"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { ChevronLeft } from "lucide-react";
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
//import { DatePicker } from "../ui/date-picker";
import { teacherImages, generalImages } from "@/constants/images";
import Image from "next/image";
import { toast } from "sonner";
import { createArrangementEvent } from "@/services/SeatingService";

interface Course {
  id: number;
  name: string;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#f87171", "#06b6d4", "#a78bfa", "#f97316"];


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
      alert("Please select a course");
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
      alert("Failed to load results. Please try again.");
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
  };

  const exportToPDF = async () => {
    if (results.length === 0) return;

    const input = document.getElementById("poll-results-section");
    if (!input) return;

    try {
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
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Global Poll Results</h1>
      </div>

      {/* Filters Section */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <select
              id="course"
              value={courseId || ""}
              onChange={(e) => setCourseId(Number(e.target.value))}
              className="col-span-3 p-2 border rounded-md"
              required
              disabled={courses.length === 0}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            {courses.length === 0 && (
              <p className="col-span-4 text-sm text-red-500 text-center">
                No courses available. Please create a course first.
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">From Date</label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">To Date</label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleLoad}
              disabled={loading || !courseId}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Load Results"}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={exportToExcel}
            disabled={loading || results.length === 0}
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-100"
          >
            Export Excel
          </Button>
          <Button
            onClick={exportToPDF}
            disabled={loading || results.length === 0}
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-100"
          >
            Export PDF
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div id="poll-results-section" className="space-y-8">
          {results.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No results found. Load data to view poll results.</p>
            </Card>
          ) : (
            results.map((poll) => (
              <Card key={poll.poll_id} className="p-6 space-y-6">
                <h2 className="text-xl font-semibold border-b pb-2">{poll.poll_title}</h2>
                {poll.questions.map((question) => (
                  <div key={question.id} className="space-y-4">
                    <h3 className="text-lg font-medium">{question.text}</h3>

                    {question.type !== "text" && question.choices && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={question.choices}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="label" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="count" name="Responses">
                              {question.choices.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {question.type === "text" && question.responses && (
                      <Card className="p-4 bg-gray-50">
                        <p className="text-sm text-gray-500 mb-2">
                          {question.responses.length} text response(s)
                        </p>
                        <div className="space-y-2">
                          {question.responses.map((response, i) => (
                            <Card key={i} className="p-3 bg-white">
                              <p>{response}</p>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                ))}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
