/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import { Button } from "../ui/button";
import ClassSelect from "../ClassSelect";
import Link from "next/link";
import { useSelector } from "react-redux";
import LineChartComponent from "../ui/line-chart";
import DoughnutChartComponent from "../ui/pie-chart";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Suspense, useEffect, useState } from "react";
import { getStudentReportCard } from "@/services/student-service";
import { Loader } from "@/components/ui/loader";
import Login from "../Home";

export default function ReportCard() {
  const { selectedClass } = useSelector((state: any) => state.generalInfo);
  const { accessToken, refreshToken, tenantDomain } = useRequestInfo();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1); // Valeur par défaut à 1

  useEffect(() => {
    const fetchData = async () => {
      if (!tenantDomain || !accessToken) {
        console.log("No logged in user");
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        const response = await getStudentReportCard(selectedStudentId, tenantDomain, accessToken);
        console.log("Report Card Data:", response);
        setReportData(response.report_card);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching report card:", err);
        setError("Failed to load report card data");
        setLoading(false);
      }
    };
  
    fetchData();
  }, [accessToken, tenantDomain, refreshToken, selectedStudentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
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
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
        <PageTitleH1 title="Academic Report Card" className="text-white" />
        <span className="text-white font-medium">{student_info.current_term}</span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap items-center gap-4">
          <ClassSelect />
          <select className="bg-white rounded-md p-2 border text-sm">
            <option>All Subjects</option>
            <option>Core Subjects</option>
            <option>Electives</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button className="flex gap-2 items-center text-lg bg-[#c586d1] hover:bg-[#A36EAD] rounded-md px-2 py-4 lg:px-4 lg:py-6">
            <Image
              src={teacherImages.save}
              alt="report"
              width={100}
              height={100}
              className="w-8 h-8"
            />
            <span>Save</span>
          </Button>
          <Link
            target="_blank"
            href={"/assets/google_search.pdf"}
            className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md px-4"
          >
            <Image
              src={teacherImages.print}
              alt="print"
              width={100}
              height={100}
              className="w-8 h-8"
            />
          </Link>
        </div>
        <select 
          className="bg-white font-bold p-1 rounded-md"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(Number(e.target.value))}
        >
          {class_information.classmates.map((classmate: any) => (
            <option key={classmate.id} value={classmate.id}>
              {classmate.name}
            </option>
          ))}
        </select>
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
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Overall Grade</p>
              <p className="text-3xl font-bold text-[#3e81d4]">{academic_performance.overall_grade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="text-2xl font-bold">{academic_performance.attendance_percentage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Behavior</p>
              <p className="text-2xl font-bold text-green-600">{academic_performance.behavior_rating}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Subject Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Subject</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3">Teacher's Comments</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{subject.name}</td>
                    <td className="p-3 text-center font-bold">{subject.grade}</td>
                    <td className="p-3 text-center">{subject.score}/{subject.max_score}</td>
                    <td className="p-3 text-sm">{subject.teacher_comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <div className="absolute text-center">
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

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-3">Teacher's Remarks</h3>
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