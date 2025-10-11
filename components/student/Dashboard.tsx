/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  MessageCircle,
  Calendar,
  BookOpen,
  Trophy,
  Clock,
  Star,
  Target,
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/app/utils/getUserFullName";
import { localStorageKey } from "@/constants/global";
import { getStudentClasses, StudentClass, getStudentDashboard, StudentDashboardData } from "@/services/StudentGradebookService";
import { getAssignments } from "@/services/AssignmentService";
import { getStudentAttendanceView, StudentAttendanceData } from "@/services/AttendanceService";
import { getStudentRewardsView, StudentRewardsData } from "@/services/RewardsService";
import { getAvailablePolls } from "@/services/student-polls-service";
import { useRequestInfo } from "@/hooks/useRequestInfo";

interface UserProfile {
  full_name: string;
  email: string;
  role: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  school?: string;
  grade?: string;
}

export default function StudentDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceData | null>(null);
  const [rewardsData, setRewardsData] = useState<StudentRewardsData | null>(null);
  const [, setPollsData] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [, setGradesLoading] = useState(true);
  const [, setAssignmentsLoading] = useState(true);
  const [, setAttendanceLoading] = useState(true);
  const [, setRewardsLoading] = useState(true);
  const [, setPollsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { tenantDomain, accessToken, isLoading: requestInfoLoading } = useRequestInfo();

  const calculateOverallAverage = (classes: StudentClass[]): number => {
    if (classes.length === 0) return 0;
    const sum = classes.reduce((acc, cls) => acc + cls.student_average, 0);
    return Math.round(sum / classes.length);
  };

  useEffect(() => {
    const loadUserData = () => {
      try {
        const basicUserData = getUserData();
        const fullUserDataStr = localStorage.getItem(localStorageKey.USER_DATA);
        const fullUserData = fullUserDataStr ? JSON.parse(fullUserDataStr) : {};
        
        setUserProfile({
          full_name: basicUserData.full_name || "Student",
          email: fullUserData.email || "student@school.edu",
          role: fullUserData.role || "student",
          phone: fullUserData.phone,
          gender: fullUserData.gender,
          date_of_birth: fullUserData.date_of_birth,
          address: fullUserData.address,
          school: fullUserData.school || "School",
          grade: fullUserData.grade || "5"
        });
      } catch (error) {
        console.error("Error loading user data:", error);
        setUserProfile({
          full_name: "Student",
          email: "student@school.edu",
          role: "student",
          school: "School",
          grade: "5"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Load API data when requestInfo is ready
  useEffect(() => {
    if (!requestInfoLoading && tenantDomain && accessToken) {
      console.log("RequestInfo ready, loading API data...", {
        tenantDomain,
        hasToken: !!accessToken,
        tenantDomainType: typeof tenantDomain,
        fullUrl: tenantDomain + '/test'
      });
      loadDashboardData();
      loadGradesData();
      loadAssignmentsData();
      loadAttendanceData();
      loadRewardsData();
      loadPollsData();
    }
  }, [requestInfoLoading, tenantDomain, accessToken]);

  const loadDashboardData = async () => {
    try {
      if (tenantDomain && accessToken) {
        console.log("Loading dashboard data with tenantDomain:", tenantDomain);
        const data = await getStudentDashboard(tenantDomain, accessToken);
        setDashboardData(data);
        
        // Update user profile with dashboard data if available
        if (data.student) {
          setUserProfile(prev => ({
            full_name: data.student.name,
            email: prev?.email || "student@school.edu",
            role: prev?.role || "student",
            phone: prev?.phone,
            gender: prev?.gender,
            date_of_birth: prev?.date_of_birth,
            address: prev?.address,
            school: prev?.school || "School",
            grade: data.student.grade_level.toString(),
          }));
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setDashboardLoading(false);
    }
  };

  const loadGradesData = async () => {
    try {
      if (tenantDomain && accessToken) {
        console.log("Loading grades with tenantDomain:", tenantDomain);
        const classes = await getStudentClasses(tenantDomain, accessToken);
        setStudentClasses(classes);
      }
    } catch (error) {
      console.error("Error loading grades data:", error);
    } finally {
      setGradesLoading(false);
    }
  };

  const loadAssignmentsData = async () => {
    try {
      if (tenantDomain && accessToken) {
        console.log("Loading assignments with tenantDomain:", tenantDomain);
        const assignmentsData = await getAssignments(tenantDomain, accessToken);
        setAssignments(assignmentsData || []);
      }
    } catch (error) {
      console.error("Error loading assignments data:", error);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const getAssignmentStats = () => {
    // Use dashboard data if available, otherwise fall back to assignments
    if (dashboardData?.recent_submissions) {
      const submissions = dashboardData.recent_submissions;
      const completed = submissions.filter(sub => sub.marked).length;
      const total = submissions.length;
      
      return {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    }
    
    if (assignments.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    // Fallback to original logic for assignments
    const completed = assignments.filter(assignment => 
      assignment.status === 'completed' || assignment.marked === true
    ).length;
    
    return {
      completed,
      total: assignments.length,
      percentage: Math.round((completed / assignments.length) * 100)
    };
  };

  const loadAttendanceData = async () => {
    try {
      if (accessToken) {
        console.log("Loading attendance with accessToken present:", !!accessToken);
        const data = await getStudentAttendanceView(accessToken);
        setAttendanceData(data);
      }
    } catch (error) {
      console.error("Error loading attendance data:", error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const getStudyTimeFromAttendance = () => {
    // Use dashboard attendance data if available, otherwise fall back to old attendance API
    if (dashboardData?.attendance) {
      const attendance = dashboardData.attendance;
      // Calculate estimated study time based on present days
      // Assuming 6 hours per school day
      const hoursPerDay = 6;
      const totalHours = attendance.present_days * hoursPerDay;
      
      if (totalHours >= 24) {
        return `${Math.round(totalHours / 24)}d`;
      }
      return `${totalHours}h`;
    }
    
    // Fallback to old attendance data structure
    if (!attendanceData || !attendanceData.summary) {
      return "0h";
    }
    
    const hoursPerDay = 6;
    const totalHours = attendanceData.summary.present * hoursPerDay;
    
    if (totalHours >= 24) {
      return `${Math.round(totalHours / 24)}d`;
    }
    return `${totalHours}h`;
  };

  const loadRewardsData = async () => {
    try {
      if (accessToken) {
        console.log("Loading rewards with accessToken present:", !!accessToken);
        const data = await getStudentRewardsView(accessToken);
        setRewardsData(data);
      }
    } catch (error) {
      console.error("Error loading rewards data:", error);
    } finally {
      setRewardsLoading(false);
    }
  };

  const getAchievementsCount = () => {
    if (!rewardsData || !rewardsData.student) {
      return 0;
    }
    
    // Count achievements based on good character points and latest news
    const goodCharacterCount = Object.keys(rewardsData.student.goodCharacter || {}).length;
    const recentGoodNews = (rewardsData.student.latestNews || []).filter(
      news => news.status === 'good'
    ).length;
    
    return goodCharacterCount + recentGoodNews;
  };

  const loadPollsData = async () => {
    try {
      if (tenantDomain && accessToken) {
        console.log("Loading polls with tenantDomain:", tenantDomain);
        const data = await getAvailablePolls(tenantDomain, accessToken);
        setPollsData(data || []);
      }
    } catch (error) {
      console.error("Error loading polls data:", error);
    } finally {
      setPollsLoading(false);
    }
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const firstName = userProfile.full_name.split(' ')[0] || 'Student';
  const initials = userProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() || 'ST';

return (
  <div className="min-h-screen">
    <section className="flex flex-col gap-6 w-full p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="rounded-2xl p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 transition-all">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-white/20 text-2xl font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-blue-100 text-sm">
              {userProfile.school} • Grade {userProfile.grade}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* <Button
            variant="secondary"
            className="rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border-white/20 transition-all"
            onClick={() => router.push("/student/settings")}
          >
            <Settings className="h-5 w-5 mr-2" /> Settings
          </Button> */}
          <Button
            className="rounded-xl bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-all"
            onClick={() => router.push("/student/communicate")}
          >
            <MessageCircle className="h-5 w-5 mr-2" /> Messages
          </Button>
        </div>
      </div>


      {/* QUICK STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: "Grade Average",
            icon: Trophy,
            value: dashboardLoading
              ? "--"
              : `${calculateOverallAverage(studentClasses)}%`,
            sub: `${studentClasses.length} classes`,
            color: "from-blue-500 to-blue-700",
          },
          {
            title: "Assignments",
            icon: BookOpen,
            value: `${getAssignmentStats().completed}/${getAssignmentStats().total}`,
            sub: `${getAssignmentStats().percentage}% done`,
            color: "from-green-500 to-green-700",
          },
          {
            title: "Attendance",
            icon: Clock,
            value: getStudyTimeFromAttendance(),
            sub:
              dashboardData?.attendance?.rate !== undefined
                ? `${dashboardData.attendance.rate}% attendance`
                : "Loading...",
            color: "from-indigo-500 to-indigo-700",
          },
          {
            title: "Rewards",
            icon: Star,
            value: getAchievementsCount(),
            sub: `${rewardsData?.student?.totalPoints || 0} points`,
            color: "from-amber-500 to-yellow-600",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="p-6 rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-full bg-gradient-to-br ${stat.color} text-white shadow-md`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.sub}</p>
              </div>
            </div>
          </Card>

        ))}
      </div>

      {/* QUICK ACTIONS */}
      <Card className="p-6 bg-white/80 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: "Attendance", icon: Calendar, link: "/student/attendance" },
            { title: "Assignments", icon: BookOpen, link: "/student/assignments" },
            { title: "Grades", icon: GraduationCap, link: "/student/gradebook" },
            { title: "Rewards", icon: Target, link: "/student/rewards" },
          ].map((action, i) => (
            <Button
              key={i}
              variant="outline"
              className="flex flex-col items-center justify-center p-5 h-auto rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:scale-[1.05] transition-all duration-300 text-gray-700 hover:text-blue-700"
              onClick={() => router.push(action.link)}
            >
              <div className="p-3 bg-blue-50 rounded-full mb-2">
                <action.icon className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold">{action.title}</span>
            </Button>

          ))}
        </div>
      </Card>

      {/* RECENT SUBMISSIONS */}
      {dashboardData?.recent_submissions && (
        <Card className="p-6 bg-white/80 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
            Recent Submissions
          </h2>

          <div className="space-y-3">
            {dashboardData.recent_submissions.slice(0, 4).map((submission) => (
              <div
                key={submission.id}
                
                className="flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:bg-blue-50/50 transition-all duration-200"

              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {submission.assessment_name}
                  </p>
                  <p className="text-sm text-gray-500">{submission.course_name}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      submission.marked
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {submission.marked ? "Graded" : "Pending"}
                  </span>
                  {submission.grade !== null && (
                    <p className="text-gray-700 font-bold mt-1">
                      {submission.grade}%
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ATTENDANCE SUMMARY */}
      {dashboardData?.attendance && (
        <Card className="p-6 bg-white/80 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Rate",
                value: `${dashboardData.attendance.rate}%`,
                color: "from-blue-500 to-blue-700",
                icon: CheckCircle,
              },
              {
                label: "Present",
                value: dashboardData.attendance.present_days,
                color: "from-green-500 to-green-700",
                icon: CheckCircle,
              },
              {
                label: "Absent",
                value: dashboardData.attendance.absent_days,
                color: "from-red-500 to-red-700",
                icon: XCircle,
              },
              {
                label: "Late",
                value: dashboardData.attendance.late_days,
                color: "from-yellow-500 to-amber-600",
                icon: AlertCircle,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-purple-50/60 transition-all duration-300"
              >
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </section>
  </div>
);


}
