/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PageTitleH1 from "@/components/ui/page-title-h1";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { views } from "@/constants/global";
import { useEffect, useState } from "react";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Loader } from "../ui/loader";
import NoDataPersonalized from "../ui/no-data-personalized";
import { getRewardsFocusView } from "@/services/RewardsService";
import { parseDomainForDisplay } from "@/utils/characterUtils";
import LineChartComponent from "../ui/line-chart";

export default function RewardsFocusedView({
  student,
  changeView,
}: {
  student: any;
  changeView: (viewName: string) => void;
}) {
  const [studentData, setStudentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    tenantDomain: tenantPrimaryDomain,
    accessToken,
    refreshToken,
  } = useRequestInfo();

  // In FocusView component
  // Dans FocusView (correct)
  useEffect(() => {
    const loadStudentDetails = async () => {
      setIsLoading(true);
      console.log("FocusView received student prop:", student);
      try {
        if (!tenantPrimaryDomain || !accessToken || !refreshToken) {
          console.error("Missing authentication credentials");
          return;
        }

        // Vérifiez la structure attendue (student.student.id)
        if (!student?.student?.id) {
          throw new Error(
            `Missing student ID. Received data: ${JSON.stringify(student)}`
          );
        }

        const data = await getRewardsFocusView(
          tenantPrimaryDomain,
          accessToken,
          refreshToken,
          "",
          "",
          student.student.id // ← Utilisez student.student.id
        );

        setStudentData(data);
      } catch (err) {
        console.error("Failed to load student details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load student details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentDetails();
  }, [tenantPrimaryDomain, accessToken, refreshToken, student?.student?.id]); // ← Dépendance sur student.student.id

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <NoDataPersonalized message={error} />
        <Button onClick={() => changeView(views.GENERAL_VIEW)}>
          Back to General View
        </Button>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <NoDataPersonalized message="No student data available" />
        <Button onClick={() => changeView(views.GENERAL_VIEW)}>
          Back to General View
        </Button>
      </div>
    );
  }

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-amber-50/30 to-orange-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => changeView(views.GENERAL_VIEW)}
            className="text-white hover:bg-white/20 rounded-xl p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <PageTitleH1 title={studentData.studentName} className="text-white font-bold text-2xl" />
              <p className="text-amber-100 text-sm mt-1">{studentData.totalPoints} total points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 space-y-6">

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{studentData.attendanceBalance.present}</p>
                <p className="text-sm font-medium text-gray-600">Present</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{Object.values(studentData.goodCharacter).reduce((a: number, b: unknown) => a + (typeof b === 'number' ? b : 0), 0)}</p>
                <p className="text-sm font-medium text-gray-600">Positive Points</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{Object.values(studentData.badCharacter).reduce((a: number, b: unknown) => a + (typeof b === 'number' ? b : 0), 0)}</p>
                <p className="text-sm font-medium text-gray-600">Growth Areas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{studentData.totalPoints}</p>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths & Growth Areas */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Performance Areas
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {studentData.goodDomains.length > 0 ? (
                    studentData.goodDomains.slice(0, 3).map((domain: any, index: number) => {
                      const { displayText } = parseDomainForDisplay(domain);
                      return (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {displayText}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-500 text-sm">No strengths recorded</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Growth Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {studentData.focusDomains.length > 0 ? (
                    studentData.focusDomains.slice(0, 3).map((domain: any, index: number) => {
                      const { displayText } = parseDomainForDisplay(domain);
                      return (
                        <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {displayText}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-500 text-sm">No growth areas identified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Score Trend */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Score Trend
            </h3>
            <div className="h-48">
              <LineChartComponent />
            </div>
          </div>
        </div>



        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h3>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg px-4 py-2 text-sm">
              View All
            </Button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {studentData.latestNews.length > 0 ? (
              studentData.latestNews.slice(0, 5).map((news: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{news.newsAndComment || "No comment"}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {news.date ? new Date(news.date).toLocaleDateString() : "N/A"} • {news.class || "N/A"}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    news.points > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {news.points > 0 ? `+${news.points}` : news.points}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
