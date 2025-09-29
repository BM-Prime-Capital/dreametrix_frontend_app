/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ClassSelect from "../ClassSelect";
//import { useSelector } from "react-redux";
import LineChartComponent from "../ui/line-chart";
import DoughnutChartComponent from "../ui/pie-chart";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import {  useEffect, useState } from "react";
import { toast } from "sonner";
import { getStudentReportCard } from "@/services/ReportCardService";
import { Skeleton } from "@/components/ui/skeleton";
///import Login from "../Home";

// Helper function to get grade variant
const getGradeVariant = (grade: string) => {
  switch (grade.toUpperCase()) {
    case 'A': return 'grade-a';
    case 'B': return 'grade-b';
    case 'C': return 'grade-c';
    case 'D': return 'grade-d';
    case 'F': return 'grade-f';
    default: return 'secondary';
  }
};

// Helper function to get performance variant
const getPerformanceVariant = (rating: string) => {
  switch (rating.toLowerCase()) {
    case 'excellent': return 'performance-excellent';
    case 'good': return 'performance-good';
    case 'satisfactory': return 'performance-satisfactory';
    default: return 'performance-needs-improvement';
  }
};

// ReportCard Skeleton component
function ReportCardSkeleton() {
  return (
    <div className="space-y-4 w-full">
      {/* Header Skeleton */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </Card>
      
      {/* Controls Skeleton */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </Card>
      
      {/* Main Content Skeleton */}
      <Card className="p-6">
        {/* Student Info */}
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-8 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Table Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="rounded-md border">
            <div className="p-4">
              <div className="grid grid-cols-5 gap-4 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4" />
                ))}
              </div>
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-4 py-3">
                  {Array.from({ length: 5 }).map((_, colIndex) => (
                    <Skeleton key={colIndex} className="h-4" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        
        {/* Additional sections skeletons */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ReportCard() {
 // const { selectedClass } = useSelector((state: any) => state.generalInfo);
  const { accessToken, refreshToken, tenantDomain } = useRequestInfo();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [selectedTermId, setSelectedTermId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      if (!tenantDomain || !accessToken) {
        console.log("No logged in user");
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        const response = await getStudentReportCard(
          accessToken,
          selectedStudentId.toString()
        );
        console.log("Report Card Data:", response);
        setReportData(response);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching report card:", err);
        setError("Failed to load report card data");
        setLoading(false);
      }
    };
  
    fetchData();
  }, [accessToken, tenantDomain, refreshToken, selectedStudentId]);

  // Save report function
  const handleSaveReport = async () => {
    if (!reportData) return;
    
    setIsSaving(true);
    try {
      // Create downloadable JSON file
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-card-${reportData.student_info.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Report saved successfully!");
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("Failed to save report");
    } finally {
      setIsSaving(false);
    }
  };

  // Print report function
  const handlePrintReport = async () => {
    setIsPrinting(true);
    try {
      // Create a print-friendly version
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Please allow pop-ups to print the report");
        return;
      }

      // Generate HTML content for printing
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Report Card - ${reportData.student_info.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #3e81d4; padding-bottom: 20px; margin-bottom: 20px; }
            .student-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .metrics { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 20px; }
            .metric { text-align: center; padding: 10px; border: 1px solid #ddd; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .grade-a { color: #16a34a; font-weight: bold; }
            .grade-b { color: #2563eb; font-weight: bold; }
            .grade-c { color: #ca8a04; font-weight: bold; }
            .grade-d { color: #ea580c; font-weight: bold; }
            .grade-f { color: #dc2626; font-weight: bold; }
            .section { margin-bottom: 30px; }
            .section h3 { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Academic Report Card</h1>
            <p>${reportData.student_info.current_term}</p>
          </div>
          
          <div class="student-info">
            <div>
              <h2>${reportData.student_info.name}</h2>
              <p>${reportData.student_info.grade_level} • Class: ${reportData.student_info.class_name}</p>
              <p>Student ID: ${reportData.student_info.student_id}</p>
            </div>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <div>Overall Grade</div>
              <div class="grade-${reportData.academic_performance.overall_grade.toLowerCase()}">${reportData.academic_performance.overall_grade}</div>
            </div>
            <div class="metric">
              <div>Score</div>
              <div>${reportData.academic_performance.overall_score}%</div>
            </div>
            <div class="metric">
              <div>Ranking</div>
              <div>${reportData.academic_performance.ranking.position}/${reportData.academic_performance.ranking.out_of}</div>
            </div>
            <div class="metric">
              <div>Attendance</div>
              <div>${reportData.academic_performance.attendance_percentage}</div>
            </div>
            <div class="metric">
              <div>Behavior</div>
              <div>${reportData.academic_performance.behavior_rating}</div>
            </div>
          </div>
          
          <div class="section">
            <h3>Subject Performance</h3>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Grade</th>
                  <th>Score</th>
                  <th>Teacher</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.subjects.map((subject: any) => `
                  <tr>
                    <td>${subject.name}</td>
                    <td class="grade-${subject.grade.toLowerCase()}">${subject.grade}</td>
                    <td>${subject.score}/${subject.max_score}</td>
                    <td>${subject.teacher_name}</td>
                    <td>${subject.teacher_comment}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h3>Teacher's Remarks</h3>
            <div>
              <h4>Strengths:</h4>
              <ul>
                ${reportData.teacher_comments.strengths.map((strength: string) => `<li>${strength}</li>`).join('')}
              </ul>
              <h4>Areas for Improvement:</h4>
              <ul>
                ${reportData.teacher_comments.areas_for_improvement.map((area: string) => `<li>${area}</li>`).join('')}
              </ul>
              <h4>General Comments:</h4>
              <p>${reportData.teacher_comments.general_remarks}</p>
            </div>
          </div>
          
          <div class="section">
            <h3>Attendance Summary</h3>
            <p>Days Present: ${reportData.attendance.term_summary.days_present}</p>
            <p>Days Absent: ${reportData.attendance.term_summary.days_absent}</p>
            <p>Days Late: ${reportData.attendance.term_summary.days_late}</p>
            <p>Attendance Rate: ${reportData.attendance.term_summary.attendance_rate}</p>
          </div>
          
          <div style="margin-top: 40px; text-align: center; font-size: 12px;">
            <p>Report generated on: ${new Date(reportData.report_metadata.generated_date).toLocaleDateString()}</p>
            <div style="margin-top: 30px;">
              <p><strong>${reportData.report_metadata.authorized_by.name}</strong></p>
              <p>${reportData.report_metadata.authorized_by.position}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
      
      toast.success("Print dialog opened!");
    } catch (error) {
      console.error("Error printing report:", error);
      toast.error("Failed to print report");
    } finally {
      setIsPrinting(false);
    }
  };

  if (loading) {
    return <ReportCardSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No report card data available</p>
          <p className="text-sm text-gray-400">Please select a student or try again later</p>
        </div>
      </div>
    );
  }

  const {
    student_info,
    academic_performance,
    subjects,
    charts,
    assessments,
    teacher_comments,
    attendance,
    class_information,
    report_metadata
  } = reportData;

  return (
    <section className="flex flex-col gap-4 w-full">
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-lg">
        <div className="flex justify-between items-center p-6">
          <div>
            <PageTitleH1 title="Academic Report Card" className="text-white mb-1" />
            <p className="text-blue-100 text-sm font-medium">
              {student_info.current_term}
            </p>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            {class_information?.available_terms?.find((t: any) => t.is_current)?.name?.split(' ')[1] || 'Current'}
          </Badge>
        </div>
      </Card>

      <Card className="bg-muted/50 border-muted">
        <div className="flex flex-wrap justify-between items-center p-4 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <Label htmlFor="class-select" className="text-xs font-medium text-muted-foreground">
                Class
              </Label>
              <ClassSelect />
            </div>
            {class_information?.available_terms && (
              <div className="space-y-1">
                <Label htmlFor="term-select" className="text-xs font-medium text-muted-foreground">
                  Term
                </Label>
                <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                  <SelectTrigger id="term-select" className="w-[200px]">
                    <SelectValue placeholder="Select term..." />
                  </SelectTrigger>
                  <SelectContent>
                    {class_information.available_terms.map((term: any) => (
                      <SelectItem key={term.id} value={term.id}>
                        {term.name}
                        {term.is_current && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Current
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="subject-filter" className="text-xs font-medium text-muted-foreground">
                Filter
              </Label>
              <Select defaultValue="all">
                <SelectTrigger id="subject-filter" className="w-[150px]">
                  <SelectValue placeholder="Filter subjects..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="core">Core Subjects</SelectItem>
                  <SelectItem value="electives">Electives</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2" 
              onClick={handleSaveReport}
              disabled={isSaving || !reportData}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Image
                  src={teacherImages.save}
                  alt="save"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              )}
              {isSaving ? "Saving..." : "Save Report"}
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2"
              onClick={handlePrintReport}
              disabled={isPrinting || !reportData}
            >
              {isPrinting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Image
                  src={teacherImages.print}
                  alt="print"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              )}
              {isPrinting ? "Printing..." : "Print"}
            </Button>
          </div>
          <Select 
            value={selectedStudentId.toString()} 
            onValueChange={(value) => setSelectedStudentId(Number(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select student..." />
            </SelectTrigger>
            <SelectContent>
              {class_information?.classmates?.map((classmate: any) => (
                <SelectItem key={classmate.id} value={classmate.id}>
                  {classmate.name}
                  {classmate.is_current && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Current
                    </Badge>
                  )}
                </SelectItem>
              )) || (
                <SelectItem value={selectedStudentId.toString()}>Current Student</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-lg p-6">
        <div className="flex flex-wrap justify-between items-center border-b pb-6 mb-6">
          <div className="flex items-center gap-4">
            <Image
              src={student_info.avatar_url || generalImages.student}
              alt="Student"
              width={80}
              height={80}
              className="rounded-full border-2 border-gray-200"
            />
            <div>
              <h2 className="text-xl font-bold">{student_info.name}</h2>
              <div className="flex gap-4 text-sm">
                <span>{student_info.grade_level} • Class: {student_info.class_name}</span>
              </div>
              <span>Student ID: {student_info.student_id}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Overall Grade</p>
              <p className={`text-3xl font-bold ${
                academic_performance.overall_grade === 'A' ? 'text-green-600' :
                academic_performance.overall_grade === 'B' ? 'text-blue-600' :
                academic_performance.overall_grade === 'C' ? 'text-yellow-600' :
                academic_performance.overall_grade === 'D' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {academic_performance.overall_grade}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-2xl font-bold">{academic_performance.overall_score}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ranking</p>
              <p className="text-2xl font-bold text-purple-600">
                {academic_performance.ranking.position}/{academic_performance.ranking.out_of}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Attendance</p>
              <p className={`text-2xl font-bold ${
                parseInt(academic_performance.attendance_percentage) >= 90 ? 'text-green-600' :
                parseInt(academic_performance.attendance_percentage) >= 75 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {academic_performance.attendance_percentage}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Behavior</p>
              <Badge variant={getPerformanceVariant(academic_performance.behavior_rating)}>
                {academic_performance.behavior_rating}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Subject Performance</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="hidden md:table-cell">Teacher</TableHead>
                  <TableHead className="hidden lg:table-cell">Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject: any, index: number) => (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getGradeVariant(subject.grade)}>
                        {subject.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">{subject.score}</span>
                      <span className="text-muted-foreground">/{subject.max_score}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {subject.teacher_name}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {subject.teacher_comment}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-bold mb-3">Grade Trend</h4>
            <div className="h-64">
              <LineChartComponent data={charts.performance_trend} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border relative">
            <h4 className="font-bold mb-3">Grade Distribution</h4>
            <div className="h-64 flex items-center justify-center">
              <DoughnutChartComponent data={charts.grade_distribution} />
              <div className="absolute text-center pointer-events-none">
                <p className="text-2xl font-bold">{charts.grade_distribution.average_score}%</p>
                <p className="text-sm text-gray-500">Class Average</p>
              </div>
            </div>
          </div>
        </div>

        {assessments.key_assessments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Key Assessments</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessments.key_assessments.map((assessment: any) => (
                <div key={assessment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{assessment.title}</span>
                    <span className="font-bold text-green-600">{assessment.score}%</span>
                  </div>
                  <div className="text-sm text-gray-500">{assessment.subject}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {assessments.upcoming_assessments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Upcoming Assessments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.upcoming_assessments.map((assessment: any) => (
                <div key={assessment.id} className="border-l-4 border-orange-400 bg-orange-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-900">{assessment.title}</h4>
                      <p className="text-sm text-orange-700 capitalize">{assessment.subject}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded">
                        Due: {new Date(assessment.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {/* Days until due calculation */}
                  <div className="text-xs text-orange-600">
                    {(() => {
                      const dueDate = new Date(assessment.due_date);
                      const today = new Date();
                      const diffTime = dueDate.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      
                      if (diffDays < 0) return "Overdue";
                      if (diffDays === 0) return "Due today";
                      if (diffDays === 1) return "Due tomorrow";
                      return `${diffDays} days remaining`;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-3">Teacher&apos;s Remarks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-700 mb-2">Strengths</h4>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                {teacher_comments.strengths.map((strength: string, index: number) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h4 className="font-bold text-yellow-700 mb-2">Areas for Improvement</h4>
              <ul className="list-disc pl-5 text-yellow-700 space-y-1">
                {teacher_comments.areas_for_improvement.map((area: string, index: number) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
          {teacher_comments.general_remarks && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold mb-2">General Comments</h4>
              <p>{teacher_comments.general_remarks}</p>
            </div>
          )}
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-bold mb-4">Attendance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border">
              <h4 className="font-bold text-blue-700 mb-3">Term Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Days Present:</span>
                  <span className="font-semibold text-green-600">{attendance.term_summary.days_present}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Days Absent:</span>
                  <span className="font-semibold text-red-600">{attendance.term_summary.days_absent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Days Late:</span>
                  <span className="font-semibold text-orange-600">{attendance.term_summary.days_late}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Attendance Rate:</span>
                    <span className="font-bold text-lg text-blue-600">{attendance.term_summary.attendance_rate}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {attendance.recent_absences.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg border">
                <h4 className="font-bold text-red-700 mb-3">Recent Absences</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {attendance.recent_absences.map((absence: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <div>
                        <span className="text-sm font-medium">
                          {new Date(absence.date).toLocaleDateString()}
                        </span>
                        {absence.reason !== "Not Applicable" && (
                          <p className="text-xs text-gray-600">{absence.reason}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        absence.excused ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                      }`}>
                        {absence.excused ? 'Excused' : 'Unexcused'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold mb-3 text-gray-700">School Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">School:</span>
                  <span className="font-medium">{report_metadata.school_info.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span>{report_metadata.school_info.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Homeroom Teacher:</span>
                  <span>{class_information.homeroom_teacher.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-xs">{class_information.homeroom_teacher.email}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold mb-3 text-blue-700">Report Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">Generated:</span>
                  <span>{new Date(report_metadata.generated_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Last Updated:</span>
                  <span>{new Date(report_metadata.last_updated).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Current Term:</span>
                  <span className="font-medium">{class_information.available_terms.find((t: any) => t.is_current)?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-8">
          <div className="text-[10px] text-gray-800">
            <p>Report generated on: {new Date(report_metadata.generated_date).toLocaleDateString()}</p>
          </div>
          <div className="text-center border-t-2 border-gray-300 pt-2 w-48">
            <p className="font-bold">{report_metadata.authorized_by.name}</p>
            <p className="text-sm">{report_metadata.authorized_by.position}</p>
            <div className="h-12 mt-2 border-b"></div>
            <p className="text-sm text-gray-500">Signature & Stamp</p>
          </div>
        </div>
      </Card>
    </section>
  );
}