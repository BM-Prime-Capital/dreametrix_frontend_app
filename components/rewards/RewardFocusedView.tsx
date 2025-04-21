"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import LineChartComponent from "../ui/line-chart";
import { views } from "@/constants/global";

export default function RewardsFocusedView({
  student,
  changeView,
}: {
  student: any;
  changeView: (viewName: string) => void;
}) {
  const { selectedClass } = useSelector((state: any) => state.generalInfo);

  return (
    <section className="flex flex-col gap-2 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => changeView(views.GENERAL_VIEW)}
            className="p-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <PageTitleH1 title="Student" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => changeView(views.GENERAL_VIEW)}
            className="flex items-center gap-1 text-muted-foreground p-0 hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>
        </div>

      </div>

      <Card className="rounded-md">
        <div className="flex flex-col p-4">
          {/* Ligne avec les 3 blocs principaux */}
         
          <div className="flex flex-col gap-6 mb-8 lg:flex-row lg:items-start">
            {/* Bloc Photo + Infos étudiant */}
            <div className="flex flex-col items-center gap-4 min-w-[200px] bg-white p-5 rounded-xl shadow-xs border border-gray-100">
            
              <div className="relative">
                <Image
                  src={generalImages.student}
                  alt="Student"
                  width={100}
                  height={100}
                  className="border-4 border-indigo-100 rounded-full"
                />
                <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-indigo-50 transition-all">
                  <Image
                    src={teacherImages.edit}
                    alt="Edit"
                    width={18}
                    height={18}
                    className="w-4 h-4"
                  />
                </button>
              </div>

              <div className="flex flex-col items-center text-center w-full">
                <h2 className="font-bold text-xl text-gray-800 break-words max-w-full">
                  Prince Ilunga
                </h2>
                <div className="mt-2 bg-indigo-50 px-4 py-2 rounded-full">
                  <span className="font-semibold text-indigo-700">Total: 84 points</span>
                </div>
              </div>
            </div>

            {/* Bloc Domaines */}
            <div className="flex flex-col gap-5 w-full max-w-[280px]">
              {/* Domains I did well in */}
              <div className="bg-white p-0 rounded-xl shadow-xs border border-emerald-100 overflow-hidden">
                <div className="bg-emerald-500 flex items-center px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <h3 className="font-bold text-white">Domains I did well in</h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-col gap-3">
                    {["Emotional Intelligence", "Integrity", "Optimism"].map((domain) => (
                      <div key={domain} className="flex items-center bg-emerald-50 px-3 py-2 rounded-lg">
                        <span className="text-emerald-800 font-medium">{domain}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Domains to focus on */}
              <div className="bg-white p-0 rounded-xl shadow-xs border border-rose-100 overflow-hidden">
                <div className="bg-rose-500 flex items-center px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <h3 className="font-bold text-white">Domains to focus on</h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center bg-rose-50 px-3 py-2 rounded-lg">
                      <span className="text-rose-800 font-medium">Self-Control</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloc Score History */}
          
            <div className="flex-1 bg-white p-5 rounded-xl shadow-xs border border-gray-100 min-w-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Score History
                </h3>
                <div className="flex gap-2">
                  <button className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">Weekly</button>
                  <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Monthly</button>
                </div>
              </div>
              <div className="h-[240px]">
                <LineChartComponent />
              </div>
            </div>
          </div>

          {/* Deuxième ligne - 3 blocs horizontaux */}

          <div className="bg-gray-50 p-5 rounded-lg mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Bloc Attendance Balance */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs">
                <h3 className="font-bold mb-4 text-lg text-indigo-600 border-b-2 border-indigo-100 pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Attendance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-indigo-50 px-3 py-2 rounded">
                    <span className="text-gray-600">Present</span>
                    <span className="font-bold text-indigo-700 bg-white px-2 py-1 rounded">56</span>
                  </div>
                  <div className="flex justify-between items-center bg-indigo-50 px-3 py-2 rounded">
                    <span className="text-gray-600">Absent</span>
                    <span className="font-bold text-indigo-700 bg-white px-2 py-1 rounded">12</span>
                  </div>
                </div>
              </div>

              {/* Bloc Good Character */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs">
                <h3 className="font-bold mb-4 text-lg text-emerald-600 border-b-2 border-emerald-100 pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Good Character
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "Integrity", value: 9, max: 4 },
                    { name: "Grit", value: 5, max: 5 },
                    { name: "Emotional Intelligence", value: 7, max: 4 },
                    { name: "Positivity", value: 14, max: 3 },
                    { name: "Self-control", value: 4, max: 5 },
                  ].map((item) => (
                    <div key={item.name} className="flex justify-between items-center hover:bg-emerald-50 px-2 py-1 rounded transition-colors">
                      <span className="text-gray-700">
                        {item.name} <span className="text-gray-400 text-xs">({item.max})</span>
                      </span>
                      <span className="font-bold text-emerald-600 bg-white px-2 rounded-full border border-emerald-100">
                        +{item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloc Bad Character */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs">
                <h3 className="font-bold mb-4 text-lg text-rose-600 border-b-2 border-rose-100 pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Bad Character
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "Integrity", value: 2, max: 4 },
                    { name: "Grit", value: 1, max: 5 },
                    { name: "Emotional Intelligence", value: 0, max: 4 },
                    { name: "Positivity", value: 1, max: 3 },
                    { name: "Self-control", value: 4, max: 5 },
                  ].map((item) => (
                    <div key={item.name} className="flex justify-between items-center hover:bg-rose-50 px-2 py-1 rounded transition-colors">
                      <span className="text-gray-700">
                        {item.name} <span className="text-gray-400 text-xs">({item.max})</span>
                      </span>
                      <span className="font-bold text-rose-600 bg-white px-2 rounded-full border border-rose-100">
                        -{item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Latest News avec bouton Load all follow-ups */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Latest News</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M8 16H3v5"></path>
                </svg>
                Load all follow-ups
              </button>
            </div>

            <Card className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Period</th>
                      <th className="p-2 text-left">Class</th>
                      <th className="p-2 text-left">Staff</th>
                      <th className="p-2 text-left">News & Comment</th>
                      <th className="p-2 text-left">Sanctions</th>
                      <th className="p-2 text-left">Points</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Wed 9 Apr 2025</td>
                      <td className="p-2">After school</td>
                      <td className="p-2">Class 6 - Math</td>
                      <td className="p-2"></td>
                      <td className="p-2">Smoking (3) Too bad to Smock</td>
                      <td className="p-2">Contacted home</td>
                      <td className="p-2 text-red-600 font-bold">-3</td>
                      <td className="p-2">
                        <div className="flex gap-2 items-center">
                          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                          </button>
                          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button className="flex items-center gap-1 text-red-600 hover:text-red-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

        </div>
      </Card>
    </section>
  );
}