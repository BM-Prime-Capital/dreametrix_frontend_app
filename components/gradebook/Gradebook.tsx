"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { GradebookTable } from "./gradebook-table";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { AddGradebookItemDialog } from "./AddGradebookItemDialog";
import { GradebookSettingsDialog } from "./GradebookSettingsDialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import { GradebookClassTable } from "./gradebook-class-table";

import { Button } from "../ui/button";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import ClassSelect from "../ClassSelect";
import { getGradeBookList } from "@/services/GradebooksService";
import { localStorageKey } from "@/constants/global";
import { ClassData } from "../types/gradebook";

interface GradebookTableProps {
  classes: ClassData[];
  setCurrentClass: (selectedClass: ClassData) => void;
}

export default function Gradebook() {
  const [currentClass, setCurrentClass] = useState<ClassData | null>(null);
  const [gradebookData, setGradebookData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'table' | 'grid' | 'compact'>('table');
  const [overviewMode, setOverviewMode] = useState<'cards' | 'table'>('cards');

  const accessToken: any = localStorage.getItem(localStorageKey.ACCESS_TOKEN);
  const refreshToken: any = localStorage.getItem(localStorageKey.REFRESH_TOKEN);

  const tenantData: any = localStorage.getItem(localStorageKey.TENANT_DATA);

  const { primary_domain } = JSON.parse(tenantData);
  const tenantPrimaryDomain = `https://${primary_domain}`;

  const handleClassSelect = (selectedClass: ClassData) => {
    setCurrentClass(selectedClass);
    localStorage.setItem(
      localStorageKey.CURRENT_SELECTED_CLASS,
      JSON.stringify(selectedClass)
    );
  };

  const handleBackToList = () => {
    setCurrentClass(null);
    localStorage.removeItem(localStorageKey.CURRENT_SELECTED_CLASS);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGradeBookList(
          tenantPrimaryDomain,
          accessToken,
          refreshToken
        );

        console.log("GradeBookList data: ", data);

        // Mapper vers le format attendu par GradebookTable
        const formatted = data.map((item: any) => {
          // Count assessments by type
          const assessmentCounts = {
            test: 0,
            quiz: 0,
            homework: 0,
            participation: 0,
            other: 0,
          };

          item.assessments.forEach((assessment: any) => {
            const type = assessment.assessment_type.toLowerCase();
            if (assessmentCounts.hasOwnProperty(type)) {
              assessmentCounts[type as keyof typeof assessmentCounts]++;
            }
          });

          return {
            id: item.course_id,
            name: item.course,
            average: `${item.class_average}%`,
            noOfExams: assessmentCounts.test,
            noOfTests: assessmentCounts.quiz,
            noOfHomeworks: assessmentCounts.homework,
            noOfParticipation: assessmentCounts.participation,
            noOfOther: assessmentCounts.other,
            totalWork:
              assessmentCounts.homework +
              assessmentCounts.test +
              assessmentCounts.quiz +
              assessmentCounts.participation +
              assessmentCounts.other,
            assessments: item.assessments, // Store full assessment data for detailed view
          };
        });

        setGradebookData(formatted);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-purple-50/30 to-pink-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Gradebook" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">
              {currentClass ? currentClass.name : "Track student performance"}
            </p>
          </div>
        </div>
        {currentClass && (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <ClassSelect />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8 space-y-6">

        {/* Enhanced Action Bar */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-4">
            {/* Layout Options for Detail View */}
            {currentClass && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex gap-3 items-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl px-6 py-3 shadow-lg font-medium transition-all duration-300">
                    <Image
                      src={generalImages.layout}
                      alt="layout"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span>Layout: {layoutMode === 'table' ? 'Table' : layoutMode === 'grid' ? 'Grid' : 'Compact'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuCheckboxItem 
                    checked={layoutMode === 'table'} 
                    onCheckedChange={() => setLayoutMode('table')}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9m-9 4h9m-9-8V6a2 2 0 012-2h2a2 2 0 012 2v4M3 14h6m0 0V10a2 2 0 012-2h2a2 2 0 012 2v4m-6 0v4" />
                      </svg>
                      Table View
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={layoutMode === 'grid'} 
                    onCheckedChange={() => setLayoutMode('grid')}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Grid View
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={layoutMode === 'compact'} 
                    onCheckedChange={() => setLayoutMode('compact')}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Compact View
                    </div>
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* View Options for Classes Overview */}
            {!currentClass && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex gap-3 items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-6 py-3 shadow-lg font-medium transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>View: {overviewMode === 'cards' ? 'Cards' : 'Table'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuCheckboxItem 
                    checked={overviewMode === 'cards'} 
                    onCheckedChange={() => setOverviewMode('cards')}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Card View
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={overviewMode === 'table'} 
                    onCheckedChange={() => setOverviewMode('table')}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9m-9 4h9m-9-8V6a2 2 0 012-2h2a2 2 0 012 2v4M3 14h6m0 0V10a2 2 0 012-2h2a2 2 0 012 2v4m-6 0v4" />
                      </svg>
                      Table View
                    </div>
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {currentClass && (
              <GradebookSettingsDialog courseId={parseInt(currentClass.id)} />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Track student performance</span>
            </div>
          </div>
        </div>

        {/* Enhanced Gradebook Card */}
        <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading gradebook data...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium text-center">{error}</p>
              </div>
            ) : currentClass ? (
              // Enhanced Class Detail View
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleBackToList}
                    className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50 rounded-xl px-4 py-2 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Classes
                  </Button>
                  <div className="text-right">
                    <h3 className="font-bold text-gray-900">{currentClass.name}</h3>
                    <p className="text-sm text-gray-600">Detailed Grade View</p>
                  </div>
                </div>

                {/* Enhanced Info Banner */}
                <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200/50 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Interactive Grade Table</p>
                      <p className="text-sm text-gray-600">Scroll horizontally to view all columns • Student names remain fixed</p>
                    </div>
                  </div>
                </div>

                {/* Dynamic Layout Container */}
                {layoutMode === 'table' && (
                  <div className="bg-gray-50/50 rounded-xl p-4 overflow-x-auto">
                    <GradebookClassTable
                      classData={currentClass}
                      onBack={handleBackToList}
                      columnCounts={{
                        test: gradebookData.find((item) => item.id === currentClass.id)?.noOfExams || 1,
                        quiz: gradebookData.find((item) => item.id === currentClass.id)?.noOfTests || 1,
                        homework: gradebookData.find((item) => item.id === currentClass.id)?.noOfHomeworks || 1,
                        participation: gradebookData.find((item) => item.id === currentClass.id)?.noOfParticipation || 1,
                        other: gradebookData.find((item) => item.id === currentClass.id)?.noOfOther || 1,
                      }}
                    />
                  </div>
                )}

                {layoutMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mock student cards for grid view */}
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {String.fromCharCode(65 + (index % 26))}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Student {index + 1}</h3>
                            <p className="text-sm text-gray-500">ID: {1000 + index}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Overall Average</span>
                            <span className="font-bold text-lg text-purple-600">{85 + Math.floor(Math.random() * 15)}%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-blue-50 p-2 rounded-lg text-center">
                              <p className="font-semibold text-blue-700">{Math.floor(Math.random() * 100)}</p>
                              <p className="text-blue-600">Tests</p>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg text-center">
                              <p className="font-semibold text-green-700">{Math.floor(Math.random() * 100)}</p>
                              <p className="text-green-600">Homework</p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded-lg text-center">
                              <p className="font-semibold text-purple-700">{Math.floor(Math.random() * 100)}</p>
                              <p className="text-purple-600">Quizzes</p>
                            </div>
                            <div className="bg-orange-50 p-2 rounded-lg text-center">
                              <p className="font-semibold text-orange-700">{Math.floor(Math.random() * 100)}</p>
                              <p className="text-orange-600">Participation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {layoutMode === 'compact' && (
                  <div className="space-y-2">
                    {/* Mock compact student list */}
                    {Array.from({ length: 20 }).map((_, index) => (
                      <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {String.fromCharCode(65 + (index % 26))}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Student {index + 1}</h3>
                              <p className="text-xs text-gray-500">ID: {1000 + index}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <p className="font-semibold text-blue-600">{Math.floor(Math.random() * 100)}</p>
                              <p className="text-xs text-gray-500">Tests</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-green-600">{Math.floor(Math.random() * 100)}</p>
                              <p className="text-xs text-gray-500">HW</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-purple-600">{Math.floor(Math.random() * 100)}</p>
                              <p className="text-xs text-gray-500">Quiz</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-orange-600">{Math.floor(Math.random() * 100)}</p>
                              <p className="text-xs text-gray-500">Part</p>
                            </div>
                            <div className="text-center bg-gray-50 px-3 py-1 rounded-lg">
                              <p className="font-bold text-lg text-gray-900">{85 + Math.floor(Math.random() * 15)}%</p>
                              <p className="text-xs text-gray-500">Average</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Enhanced Classes Overview
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Classes</h3>
                  <p className="text-gray-600">Select a class to view detailed grades and manage assessments</p>
                </div>

                {/* Dynamic Classes Display */}
                {gradebookData.length > 0 ? (
                  overviewMode === 'cards' ? (
                    // Card View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gradebookData.map((classItem, index) => (
                        <div 
                          key={classItem.id} 
                          className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                          onClick={() => handleClassSelect(classItem)}
                        >
                          <div className={`p-6 text-white ${
                            index % 4 === 0 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                            index % 4 === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            index % 4 === 2 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            'bg-gradient-to-r from-orange-500 to-orange-600'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1 line-clamp-2">{classItem.name}</h3>
                                <p className="text-white/80 text-sm">Class Average: {classItem.average}</p>
                              </div>
                              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-blue-600">{classItem.noOfExams}</p>
                                <p className="text-xs text-blue-600 font-medium">Tests</p>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-green-600">{classItem.noOfHomeworks}</p>
                                <p className="text-xs text-green-600 font-medium">Homework</p>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-purple-600">{classItem.noOfTests}</p>
                                <p className="text-xs text-purple-600 font-medium">Quizzes</p>
                              </div>
                              <div className="bg-orange-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-orange-600">{classItem.noOfParticipation}</p>
                                <p className="text-xs text-orange-600 font-medium">Participation</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Total Assessments</span>
                                <span className="text-xl font-bold text-gray-900">{classItem.totalWork}</span>
                              </div>
                              <div className="mt-2 bg-gray-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min((classItem.totalWork / 20) * 100, 100)}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-gray-100 p-4">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Click to view details</span>
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Original Table View
                    <>
                      <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 border border-purple-200/50 rounded-xl p-4 backdrop-blur-sm mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Classes Overview</p>
                            <p className="text-sm text-gray-600">Scroll horizontally to view all assessment columns • Class names remain fixed</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50/50 rounded-xl p-4 overflow-x-auto">
                        <GradebookTable classes={gradebookData} onClassSelect={handleClassSelect} />
                      </div>
                    </>
                  )
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                    <p className="text-gray-500">Your gradebook classes will appear here once they're set up</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
