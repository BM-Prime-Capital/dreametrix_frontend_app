"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import LineChartComponent from "../ui/line-chart";
import { localStorageKey, views } from "@/constants/global";
import { useEffect, useState } from "react";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Loader } from "../ui/loader"; 
import NoDataPersonalized from "../ui/no-data-personalized";

import { getRewardsFocusView } from "@/services/RewardsService";

export default function RewardsFocusedView({
  student,
  changeView,
}: {
  student: any;
  changeView: (viewName: string) => void;
}) {
  const { selectedClass } = useSelector((state: any) => state.generalInfo);
  const [studentData, setStudentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  //space
  const { tenantDomain: tenantPrimaryDomain, accessToken, refreshToken } = useRequestInfo();
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const currentClass = JSON.parse(
    localStorage.getItem(localStorageKey.CURRENT_SELECTED_CLASS)!
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [rewardsCount, setRewardsCount] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
          throw new Error(`Missing student ID. Received data: ${JSON.stringify(student)}`);
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
        setError(err instanceof Error ? err.message : "Failed to load student details");
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
          <PageTitleH1 title="Student Details" />
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
                  {studentData.studentName}
                </h2>
                <div className="mt-2 bg-indigo-50 px-4 py-2 rounded-full">
                  <span className="font-semibold text-indigo-700">
                    Total: {studentData.totalPoints} points
                  </span>
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
                    {studentData.goodDomains.length > 0 ? (
                      studentData.goodDomains.map((domain: string) => (
                        <div key={domain} className="flex items-center bg-emerald-50 px-3 py-2 rounded-lg">
                          <span className="text-emerald-800 font-medium">{domain}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-2">No domains found</div>
                    )}
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
                    {studentData.focusDomains.length > 0 ? (
                      studentData.focusDomains.map((domain: string) => (
                        <div key={domain} className="flex items-center bg-rose-50 px-3 py-2 rounded-lg">
                          <span className="text-rose-800 font-medium">{domain}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-2">No focus domains</div>
                    )}
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
                    <span className="font-bold text-indigo-700 bg-white px-2 py-1 rounded">
                      {studentData.attendanceBalance.present}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-indigo-50 px-3 py-2 rounded">
                    <span className="text-gray-600">Absent</span>
                    <span className="font-bold text-indigo-700 bg-white px-2 py-1 rounded">
                      {studentData.attendanceBalance.absent}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-indigo-50 px-3 py-2 rounded">
                    <span className="text-gray-600">Late</span>
                    <span className="font-bold text-indigo-700 bg-white px-2 py-1 rounded">
                      {studentData.attendanceBalance.late}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-indigo-50 px-3 py-2 rounded">
                    <span className="text-gray-600">Half Day</span>
                    <span className="font-bold text-indigo-700 bg-white px-2 py-1 rounded">
                      {studentData.attendanceBalance.half_day}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloc Good Character */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs">
                <h3 className="font-bold mb-4 text-lg text-emerald-600 border-b-2 border-emerald-100 pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Good Character
                </h3>
                <div className="space-y-2">
                  {Object.entries(studentData.goodCharacter).length > 0 ? (
                    Object.entries(studentData.goodCharacter).map(([domain, points]) => (
                      <div key={domain} className="flex justify-between items-center hover:bg-emerald-50 px-2 py-1 rounded transition-colors">
                        <span className="text-gray-700 capitalize">
                          {domain}
                        </span>
                        <span className="font-bold text-emerald-600 bg-white px-2 rounded-full border border-emerald-100">
                          +{typeof points === "number" ? points : 0}
                        </span>

                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-2">No good character data</div>
                  )}
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
                  {Object.entries(studentData.badCharacter).length > 0 ? (
                    Object.entries(studentData.badCharacter).map(([domain, points]) => (
                      <div key={domain} className="flex justify-between items-center hover:bg-rose-50 px-2 py-1 rounded transition-colors">
                        <span className="text-gray-700 capitalize">
                          {domain}
                        </span>
                        <span className="font-bold text-rose-600 bg-white px-2 rounded-full border border-rose-100">
                          {typeof points === "number" ? points : 0}
                        </span>

                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-2">No bad character data</div>
                  )}
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
                      <th className="p-2 text-left">News & Comment</th>
                      <th className="p-2 text-left">Sanctions</th>
                      <th className="p-2 text-left">Points</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.latestNews.length > 0 ? (
                      studentData.latestNews.map((news: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{news.date ? new Date(news.date).toLocaleDateString() : 'N/A'}</td>
                          <td className="p-2">{news.period || 'N/A'}</td>
                          <td className="p-2">{news.class || 'N/A'}</td>
                          <td className="p-2">{news.newsAndComment || 'N/A'}</td>
                          <td className="p-2">{news.sanctions || 'None'}</td>
                          <td className={`p-2 font-bold ${news.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {news.points > 0 ? `+${news.points}` : news.points}
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2 items-center">
                              {news.followUp?.edit && (
                                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                  </svg>
                                </button>
                              )}
                              {news.followUp?.delete && (
                                <button className="flex items-center gap-1 text-rose-600 hover:text-rose-800">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500">
                          No news available
                        </td>
                      </tr>
                    )}
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