/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import PageTitleH1 from "../ui/page-title-h1";
import PageTitleH2 from "../ui/page-title-h2";
import { useEffect, useState } from "react";
import { localStorageKey } from "@/constants/global";
import { getTeacherDashboardData } from "@/services/AssignmentService";
import { useRouter } from "next/navigation";
import { userPath } from "@/constants/userConstants";
import { useRequestInfo } from "@/hooks/useRequestInfo";

interface TeacherDashboardData {
  teacher_info: {
    id: number;
    name: string;
    email: string;
  };
  summary: {
    total_courses: number;
    total_students: number;
    pending_submissions: number;
    upcoming_assessments: number;
    unread_notifications: number;
  };
  courses: Array<{
    id: number;
    name: string;
    subject: string;
    grade: string;
    student_count: number;
    class_average: number;
  }>;
  recent_submissions: Array<{
    id: number;
    student_name: string;
    course_name: string;
    assessment_name: string;
    assessment_type: string;
    submitted_at: string;
    days_ago: number;
  }>;
  upcoming_assessments: Array<{
    id: number;
    name: string;
    course_name: string;
    type: string;
    due_date: string;
    days_until_due: number;
    published: boolean;
  }>;
  attendance_summary: {
    present: number;
    absent: number;
    late: number;
    half_day: number;
  };
}

export default function TeacherDashboard() {
  const router = useRouter();
  const { tenantDomain: tenantPrimaryDomain, accessToken } = useRequestInfo();
  
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);

  useEffect(() => {
    console.log('useEffect triggered', {
      tenantPrimaryDomain,
      accessToken: accessToken ? 'present' : 'missing',
      hasUserData: !!userData
    });
  
    const fetchDashboardData = async () => {
      try {
        const data = await getTeacherDashboardData(tenantPrimaryDomain, accessToken);
        
        if (data) {
          setDashboardData(data);
          return;
        }
        
      } catch (error) {
        console.error("Error fetching teacher dashboard data:", error);
      }
    };
  
    if (tenantPrimaryDomain && accessToken) {
      fetchDashboardData();
    } else {
      console.log('Skipping API call - missing credentials');
    }
  }, [tenantPrimaryDomain, accessToken]);

  const quickActions = [
    { 
      icon: "📝", 
      title: "Create Assignment", 
      desc: "New homework or task",
      path: `${userPath.TEACHER_BASE_PATH}/assignments`
    },
    { 
      icon: "📊", 
      title: "View Gradebook", 
      desc: "Student progress and grades",
      path: `${userPath.TEACHER_BASE_PATH}/gradebook`
    },
    { 
      icon: "💬", 
      title: "Communicate", 
      desc: "Contact parents and students",
      path: `${userPath.TEACHER_BASE_PATH}/communicate`
    },
    { 
      icon: "📅", 
      title: "Attendance", 
      desc: "Manage student attendance",
      path: `${userPath.TEACHER_BASE_PATH}/attendance`
    },
    { 
      icon: "🎯", 
      title: "Test Prep", 
      desc: "Practice questions and tests",
      path: `${userPath.TEACHER_BASE_PATH}/test_prep`
    },
    { 
      icon: "⭐", 
      title: "Rewards", 
      desc: "Student recognition system",
      path: `${userPath.TEACHER_BASE_PATH}/rewards`
    },
    { 
      icon: "👥", 
      title: "Classes", 
      desc: "Manage your classes",
      path: `${userPath.TEACHER_BASE_PATH}/classes`
    },
    { 
      icon: "📚", 
      title: "Digital Library", 
      desc: "Educational resources",
      path: `${userPath.TEACHER_BASE_PATH}/digital_library`
    }
  ];

  const handleQuickActionClick = (path: string) => {
    router.push(path);
  };

  // Calculate class distribution from dashboard data
  const classDistributionData = dashboardData?.courses.reduce((acc: any, course) => {
    const subject = course.subject || 'Other';
    acc[subject] = (acc[subject] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <section className="flex flex-col w-full h-full bg-gradient-to-br from-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Teacher Dashboard" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">Your teaching command center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-white text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <span className="text-white/95 text-base flex items-center font-medium">
            Welcome, {userData.full_name.split(' ')[0]}
            <span className="ml-2 text-xl">👋</span>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mx-6 pb-8 space-y-8 overflow-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-2">
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashboardData?.summary.total_students || 0}
                </p>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashboardData?.summary.total_courses || 0}
                </p>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashboardData?.summary.pending_submissions || 0}
                </p>
                <p className="text-sm font-medium text-gray-600">Pending Submissions</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashboardData?.summary.upcoming_assessments || 0}
                </p>
                <p className="text-sm font-medium text-gray-600">Upcoming Assessments</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {dashboardData?.summary.unread_notifications || 0}
                </p>
                <p className="text-sm font-medium text-gray-600">Unread Notifications</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <PageTitleH2 title="Quick Actions" className="text-gray-800" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button 
                key={index} 
                onClick={() => handleQuickActionClick(action.path)}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left hover:shadow-md hover:scale-105 transform duration-200"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="font-medium text-gray-800 text-sm">{action.title}</p>
                <p className="text-xs text-gray-600">{action.desc}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Submissions & Upcoming Assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Submissions */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <PageTitleH2 title="Recent Submissions" className="text-gray-800 mb-4" />
            <div className="space-y-4">
              {dashboardData?.recent_submissions.slice(0, 5).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{submission.student_name}</p>
                    <p className="text-xs text-gray-600">{submission.course_name}</p>
                    <p className="text-xs text-gray-500">{submission.assessment_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      {submission.days_ago === 0 ? 'Today' : `${submission.days_ago}d ago`}
                    </span>
                  </div>
                </div>
              ))}
              {(!dashboardData?.recent_submissions || dashboardData.recent_submissions.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">No recent submissions</p>
              )}
            </div>
          </Card>

          {/* Upcoming Assessments */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <PageTitleH2 title="Upcoming Assessments" className="text-gray-800 mb-4" />
            <div className="space-y-4">
              {dashboardData?.upcoming_assessments.slice(0, 5).map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm truncate">{assessment.name}</p>
                    <p className="text-xs text-gray-600">{assessment.course_name}</p>
                    <p className="text-xs text-gray-500">{assessment.type}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      assessment.days_until_due === 0 
                        ? 'bg-red-100 text-red-800' 
                        : assessment.days_until_due <= 2 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {assessment.days_until_due === 0 ? 'Due Today' : `${assessment.days_until_due}d left`}
                    </span>
                  </div>
                </div>
              ))}
              {(!dashboardData?.upcoming_assessments || dashboardData.upcoming_assessments.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">No upcoming assessments</p>
              )}
            </div>
          </Card>
        </div>

        {/* Class Distribution & Attendance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Class Distribution Chart */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <PageTitleH2 title="Class Distribution by Subject" className="text-gray-800 mb-4" />
            <div className="space-y-3">
              {Object.entries(classDistributionData).map(([subject, count], index) => {
                const totalClasses = dashboardData?.summary.total_courses || 1;
                const percentage = ((count as number) / totalClasses) * 100;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
                
                return (
                  <div key={subject} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                      {subject}
                    </span>
                    <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${colors[index % colors.length]} h-2 rounded-full`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 min-w-[30px]">{count as number}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Attendance Summary */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <PageTitleH2 title="Attendance Summary" className="text-gray-800 mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Present</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(dashboardData?.attendance_summary.present || 0) / 
                          Math.max((dashboardData?.attendance_summary.present || 0) + 
                          (dashboardData?.attendance_summary.absent || 0) + 
                          (dashboardData?.attendance_summary.late || 0) + 
                          (dashboardData?.attendance_summary.half_day || 0), 1) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{dashboardData?.attendance_summary.present || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Absent</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(dashboardData?.attendance_summary.absent || 0) / 
                          Math.max((dashboardData?.attendance_summary.present || 0) + 
                          (dashboardData?.attendance_summary.absent || 0) + 
                          (dashboardData?.attendance_summary.late || 0) + 
                          (dashboardData?.attendance_summary.half_day || 0), 1) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{dashboardData?.attendance_summary.absent || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Late</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(dashboardData?.attendance_summary.late || 0) / 
                          Math.max((dashboardData?.attendance_summary.present || 0) + 
                          (dashboardData?.attendance_summary.absent || 0) + 
                          (dashboardData?.attendance_summary.late || 0) + 
                          (dashboardData?.attendance_summary.half_day || 0), 1) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{dashboardData?.attendance_summary.late || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Half Day</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(dashboardData?.attendance_summary.half_day || 0) / 
                          Math.max((dashboardData?.attendance_summary.present || 0) + 
                          (dashboardData?.attendance_summary.absent || 0) + 
                          (dashboardData?.attendance_summary.late || 0) + 
                          (dashboardData?.attendance_summary.half_day || 0), 1) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{dashboardData?.attendance_summary.half_day || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}