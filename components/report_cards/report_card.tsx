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

export default function ReportCard() {
  const { selectedClass } = useSelector((state: any) => state.generalInfo);

  const subjects = [
    { name: "Mathematics", grade: "A", score: 92, comment: "Excellent problem-solving skills" },
    { name: "English", grade: "B+", score: 87, comment: "Strong writing ability" },
    { name: "Science", grade: "A-", score: 90, comment: "Outstanding lab work" },
    { name: "History", grade: "B", score: 83, comment: "Needs more historical context" },
    { name: "Physical Education", grade: "A", score: 95, comment: "Team leader" },
  ];

  const averageGrade = "A-";
  const overallScore = 89;
  const attendance = "96%";
  const behavior = "Excellent";

  return (
    <section className="flex flex-col gap-4 w-full">
      
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
        <PageTitleH1 title="Academic Report Card" className="text-white" />
        <span className="text-white font-medium">Term 2 • 2023-2024</span>
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
          <Button className="flex gap-2 items-center text-lg bg-[#c586d1] hover:bg-[#A36EAD] rounded-md  px-2 py-4 lg:px-4 lg:py-6">
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
        <select className="bg-white font-bold p-1 rounded-md">
          <option>Prince Ilunga</option>
          <option>Josue Clever</option>
          <option>Jordan Wise</option>
          <option>Nehemie Intelo</option>
          <option>Henock Preso</option>
        </select>
      </div>

      
      <Card className="rounded-lg p-6">
        
        <div className="flex flex-wrap justify-between items-center border-b pb-6 mb-6">
          <div className="flex items-center gap-4">
            <Image
              src={generalImages.student}
              alt="Student"
              width={80}
              height={80}
              className="rounded-full border-2 border-gray-200"
            />
            <div>
              <h2 className="text-xl font-bold">Prince Ilunga</h2>
              <div className="flex gap-4 text-sm">
                <span>Grade 5 • Class: {selectedClass || "5-B"}</span>
                
              </div>
              <span>Student ID: STU-2024-005</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Overall Grade</p>
              <p className="text-3xl font-bold text-[#3e81d4]">{averageGrade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="text-2xl font-bold">{attendance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Behavior</p>
              <p className="text-2xl font-bold text-green-600">{behavior}</p>
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
                  <th className="p-3">Teacher&apos;s Comments</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{subject.name}</td>
                    <td className="p-3 text-center font-bold">{subject.grade}</td>
                    <td className="p-3 text-center">{subject.score}/100</td>
                    <td className="p-3 text-sm">{subject.comment}</td>
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
              <LineChartComponent />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border relative">
            <h4 className="font-bold mb-3">Grade Distribution</h4>
            <div className="h-64 flex items-center justify-center">
              <DoughnutChartComponent />
              <div className="absolute text-center">
                <p className="text-2xl font-bold">{overallScore}%</p>
                <p className="text-sm text-gray-500">Class Average</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Key Assessments</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Math Midterm</span>
                <span className="font-bold text-green-600">94%</span>
              </div>
              <div className="text-sm text-gray-500">Algebra & Geometry</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Science Project</span>
                <span className="font-bold text-blue-600">88%</span>
              </div>
              <div className="text-sm text-gray-500">Ecosystems Presentation</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Reading Level</span>
                <span className="font-bold text-purple-600">Grade 6.2</span>
              </div>
              <div className="text-sm text-gray-500">Lexile Measure</div>
            </div>
          </div>
        </div>

        
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-3">Teacher&apos;s Remarks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-700 mb-2">Strengths</h4>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                <li>Exceptional mathematical reasoning</li>
                <li>Active class participation</li>
                <li>Strong leadership in group work</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h4 className="font-bold text-yellow-700 mb-2">Areas for Improvement</h4>
              <ul className="list-disc pl-5 text-yellow-700 space-y-1">
                <li>Time management during tests</li>
                <li>Historical context understanding</li>
                <li>Neatness in written work</li>
              </ul>
            </div>
          </div>
        </div>

       
        <div className="flex justify-between items-end mt-8">
          <div className="text-[10px] text-gray-800">
            <p>Report generated on: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-center border-t-2 border-gray-300 pt-2 w-48">
            <p className="font-bold">School Principal</p>
            <div className="h-12 mt-2 border-b"></div>
            <p className="text-sm text-gray-500">Signature & Stamp</p>
          </div>
        </div>
      </Card>
    </section>
  );
}