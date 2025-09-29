"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Instagram,
  MessageCircle,
  Calendar,
  BookOpen,
  Trophy,
  Clock,
  Star,
  Target,
  GraduationCap,
  Zap,
  Users,
  Settings,
  Bell,
  TrendingUp,
  Award,
  BookMarked,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import PageTitleH1 from "../ui/page-title-h1";
import StudentProgress from "./StudentProgress";
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
  const [pollsData, setPollsData] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [gradesLoading, setGradesLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [rewardsLoading, setRewardsLoading] = useState(true);
  const [pollsLoading, setPollsLoading] = useState(true);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <section className="flex flex-col gap-6 w-full">
        {/* Header Section Moderne */}
        <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between text-white">
            <div className="flex items-center gap-6 mb-6 md:mb-0">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center border-2 border-white">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
                <p className="text-white/90 text-lg">
                  Ready to learn something new today?
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <BookMarked className="h-4 w-4" />
                    <span className="text-sm">Grade {userProfile.grade}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">
                      {rewardsLoading ? "Student" : 
                       rewardsData?.student?.totalPoints && rewardsData.student.totalPoints > 100 ? "Top Student" :
                       rewardsData?.student?.totalPoints && rewardsData.student.totalPoints > 50 ? "Good Student" :
                       "Student"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 relative rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-[#FF5252] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {assignmentsLoading ? "0" : Math.max(0, getAssignmentStats().total - getAssignmentStats().completed)}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </div> */}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-6">
            {/* Quick Stats Section Moderne */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-[#4CAF50] to-[#45A049] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-medium">Grade Average</p>
                    <p className="text-3xl font-bold">
                      {dashboardLoading ? "--" : dashboardData?.academic_overview?.overall_average ? `${dashboardData.academic_overview.overall_average}%` : `${calculateOverallAverage(studentClasses)}%`}
                    </p>
                    <p className="text-white/70 text-xs">
                      {dashboardData?.academic_overview?.total_courses || studentClasses.length} {(dashboardData?.academic_overview?.total_courses || studentClasses.length) === 1 ? 'class' : 'classes'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-medium">Assignments</p>
                    <p className="text-3xl font-bold">
                      {(dashboardLoading && assignmentsLoading) ? "--" : `${getAssignmentStats().completed}/${getAssignmentStats().total}`}
                    </p>
                    <p className="text-white/70 text-xs">
                      {(dashboardLoading && assignmentsLoading) ? "Loading..." : `${getAssignmentStats().percentage}% completed`}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Clock className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-medium">Study Time</p>
                    <p className="text-3xl font-bold">
                      {attendanceLoading ? "--" : getStudyTimeFromAttendance()}
                    </p>
                    <p className="text-white/70 text-xs">
                      {dashboardData?.attendance ? `${dashboardData.attendance.rate}% attendance` : 
                       attendanceData ? `${attendanceData.summary?.attendance_rate || 0}% attendance` : "This month"}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#FF9800] to-[#F57C00] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Star className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-medium">Achievements</p>
                    <p className="text-3xl font-bold">
                      {rewardsLoading ? "--" : getAchievementsCount()}
                    </p>
                    <p className="text-white/70 text-xs">
                      {rewardsData ? `${rewardsData.student?.totalPoints || 0} points` : "Total earned"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions Moderne */}
            <Card className="p-8 shadow-xl border-0 bg-white rounded-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  className="h-auto flex-col gap-3 p-6 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#25AAE1] transition-all duration-300 transform hover:scale-105 rounded-xl shadow-lg"
                  onClick={() => router.push("/student/attendance")}
                >
                  <Calendar className="h-8 w-8" />
                  <span className="text-sm font-semibold">Attendance</span>
                </Button>
                <Button
                  className="h-auto flex-col gap-3 p-6 bg-gradient-to-br from-[#4CAF50] to-[#45A049] hover:from-[#45A049] hover:to-[#4CAF50] transition-all duration-300 transform hover:scale-105 rounded-xl shadow-lg"
                  onClick={() => router.push("/student/assignments")}
                >
                  <BookOpen className="h-8 w-8" />
                  <span className="text-sm font-semibold">Assignments</span>
                </Button>
                <Button
                  className="h-auto flex-col gap-3 p-6 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#25AAE1] transition-all duration-300 transform hover:scale-105 rounded-xl shadow-lg"
                  onClick={() => router.push("/student/gradebook")}
                >
                  <GraduationCap className="h-8 w-8" />
                  <span className="text-sm font-semibold">Grades</span>
                </Button>
                <Button
                  className="h-auto flex-col gap-3 p-6 bg-gradient-to-br from-[#FF9800] to-[#F57C00] hover:from-[#F57C00] hover:to-[#FF9800] transition-all duration-300 transform hover:scale-105 rounded-xl shadow-lg"
                  onClick={() => router.push("/student/rewards")}
                >
                  <Target className="h-8 w-8" />
                  <span className="text-sm font-semibold">Rewards</span>
                </Button>
              </div>
            </Card>

            {/* Student Progress Section */}
            <StudentProgress dashboardData={dashboardData} />

            {/* Recent Submissions Section */}
            {dashboardData?.recent_submissions && dashboardData.recent_submissions.length > 0 && (
              <Card className="p-8 shadow-xl border-0 bg-white rounded-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-[#4CAF50] to-[#45A049] rounded-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  Recent Submissions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.recent_submissions.slice(0, 4).map((submission) => (
                    <div 
                      key={submission.id} 
                      className={`flex items-center gap-4 p-4 rounded-xl ${
                        submission.marked && submission.grade !== null 
                          ? submission.grade >= 85 ? 'bg-green-50' 
                            : submission.grade >= 70 ? 'bg-yellow-50'
                            : 'bg-red-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${
                        submission.marked && submission.grade !== null
                          ? submission.grade >= 85 ? 'bg-green-500'
                            : submission.grade >= 70 ? 'bg-yellow-500' 
                            : 'bg-red-500'
                          : 'bg-gray-400'
                      }`}>
                        {submission.marked && submission.grade !== null 
                          ? <Trophy className="h-6 w-6 text-white" />
                          : <Clock className="h-6 w-6 text-white" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{submission.assessment_name}</p>
                        <p className="text-sm text-gray-600">{submission.course_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            submission.marked 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {submission.marked ? 'Graded' : 'Pending'}
                          </span>
                          {submission.grade !== null && (
                            <span className="text-sm font-semibold text-gray-700">
                              {submission.grade}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Attendance Summary Section */}
            {dashboardData?.attendance && (
              <Card className="p-8 shadow-xl border-0 bg-white rounded-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  Attendance Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Attendance Rate */}
                  <div className={`p-4 rounded-xl ${
                    dashboardData.attendance.rate >= 95 ? 'bg-green-50' :
                    dashboardData.attendance.rate >= 85 ? 'bg-yellow-50' :
                    'bg-red-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        dashboardData.attendance.rate >= 95 ? 'bg-green-500' :
                        dashboardData.attendance.rate >= 85 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {dashboardData.attendance.rate >= 95 ? 
                          <CheckCircle className="h-5 w-5 text-white" /> :
                          dashboardData.attendance.rate >= 85 ?
                          <AlertCircle className="h-5 w-5 text-white" /> :
                          <XCircle className="h-5 w-5 text-white" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Overall Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.attendance.rate}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Present Days */}
                  <div className="p-4 rounded-xl bg-green-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-xl">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Present</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.attendance.present_days}</p>
                        <p className="text-sm text-gray-600">of {dashboardData.attendance.total_days} days</p>
                      </div>
                    </div>
                  </div>

                  {/* Absent Days */}
                  <div className="p-4 rounded-xl bg-red-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500 rounded-xl">
                        <XCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Absent</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.attendance.absent_days}</p>
                        <p className="text-sm text-gray-600">days missed</p>
                      </div>
                    </div>
                  </div>

                  {/* Late Days */}
                  <div className="p-4 rounded-xl bg-yellow-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Late</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.attendance.late_days}</p>
                        <p className="text-sm text-gray-600">days late</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Achievements Section Moderne */}
            <Card className="p-8 shadow-xl border-0 bg-white rounded-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[#FF9800] to-[#F57C00] rounded-xl">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                Recent Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewardsLoading ? (
                  // Loading state
                  <>
                    <div className="flex items-center gap-4 p-6 bg-gray-100 rounded-2xl animate-pulse">
                      <div className="p-4 bg-gray-300 rounded-xl w-16 h-16"></div>
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 bg-gray-100 rounded-2xl animate-pulse">
                      <div className="p-4 bg-gray-300 rounded-xl w-16 h-16"></div>
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-28 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </>
                ) : rewardsData?.student?.latestNews && rewardsData.student.latestNews.length > 0 ? (
                  // Real achievements from API
                  rewardsData.student.latestNews.slice(0, 2).map((news, index) => (
                    <div key={index} className={`flex items-center gap-4 p-6 bg-gradient-to-r ${news.status === 'good' ? 'from-[#4CAF50]/10 to-[#45A049]/10' : 'from-[#FF9800]/10 to-[#F57C00]/10'} rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                      <div className={`p-4 ${news.status === 'good' ? 'bg-[#4CAF50]' : 'bg-[#FF9800]'} rounded-xl`}>
                        {news.status === 'good' ? <Trophy className="h-8 w-8 text-white" /> : <Star className="h-8 w-8 text-white" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">
                          {news.status === 'good' ? 'Great Work!' : 'Activity'}
                        </p>
                        <p className="text-gray-600">
                          {news.class} - {new Date(news.date).toLocaleDateString()}
                        </p>
                        <p className={`text-sm font-semibold ${news.status === 'good' ? 'text-[#4CAF50]' : 'text-[#FF9800]'}`}>
                          {news.points > 0 ? `+${news.points}` : news.points} points
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback when no achievements
                  <>
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#25AAE1]/10 to-[#1D8CB3]/10 rounded-2xl">
                      <div className="p-4 bg-[#25AAE1] rounded-xl">
                        <Star className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">Keep Going!</p>
                        <p className="text-gray-600">Your achievements will appear here</p>
                        <p className="text-[#25AAE1] text-sm font-semibold">Stay motivated</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#4CAF50]/10 to-[#45A049]/10 rounded-2xl">
                      <div className="p-4 bg-[#4CAF50] rounded-xl">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">Ready to Excel!</p>
                        <p className="text-gray-600">Complete assignments to earn points</p>
                        <p className="text-[#4CAF50] text-sm font-semibold">Start now</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Today's Schedule Quick View Moderne */}
            <Card className="p-8 shadow-xl border-0 bg-white rounded-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                Today&apos;s Schedule
              </h2>
              <div className="space-y-4">
                {(dashboardLoading && gradesLoading) ? (
                  // Loading state
                  <>
                    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl animate-pulse">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl animate-pulse">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-28"></div>
                      </div>
                    </div>
                  </>
                ) : dashboardData?.academic_overview?.courses && dashboardData.academic_overview.courses.length > 0 ? (
                  // Real courses from dashboard API
                  dashboardData.academic_overview.courses.slice(0, 3).map((course, index) => {
                    const colors = [
                      { bg: 'from-[#25AAE1]/10 to-[#1D8CB3]/10', dot: 'bg-[#25AAE1]', text: 'text-[#25AAE1]' },
                      { bg: 'from-[#4CAF50]/10 to-[#45A049]/10', dot: 'bg-[#4CAF50]', text: 'text-[#4CAF50]' },
                      { bg: 'from-[#FF9800]/10 to-[#F57C00]/10', dot: 'bg-[#FF9800]', text: 'text-[#FF9800]' }
                    ];
                    const color = colors[index % colors.length];
                    const status = index === 0 ? 'Available' : index === 1 ? 'Upcoming' : 'Later';
                    
                    return (
                      <div key={course.id} className={`flex items-center gap-4 p-4 bg-gradient-to-r ${color.bg} rounded-xl hover:shadow-md transition-all duration-200`}>
                        <div className={`w-4 h-4 ${color.dot} rounded-full`}></div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{course.name}</p>
                          <p className="text-gray-600">
                            {course.subject} • {course.teacher} • Grade: {course.grade}%
                          </p>
                        </div>
                        <div className={`${color.text} font-semibold`}>{status}</div>
                      </div>
                    );
                  })
                ) : studentClasses && studentClasses.length > 0 ? (
                  // Fallback to original studentClasses data
                  studentClasses.slice(0, 3).map((studentClass, index) => {
                    const colors = [
                      { bg: 'from-[#25AAE1]/10 to-[#1D8CB3]/10', dot: 'bg-[#25AAE1]', text: 'text-[#25AAE1]' },
                      { bg: 'from-[#4CAF50]/10 to-[#45A049]/10', dot: 'bg-[#4CAF50]', text: 'text-[#4CAF50]' },
                      { bg: 'from-[#FF9800]/10 to-[#F57C00]/10', dot: 'bg-[#FF9800]', text: 'text-[#FF9800]' }
                    ];
                    const color = colors[index % colors.length];
                    const status = index === 0 ? 'Available' : index === 1 ? 'Upcoming' : 'Later';
                    
                    return (
                      <div key={studentClass.course_id} className={`flex items-center gap-4 p-4 bg-gradient-to-r ${color.bg} rounded-xl hover:shadow-md transition-all duration-200`}>
                        <div className={`w-4 h-4 ${color.dot} rounded-full`}></div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{studentClass.course}</p>
                          <p className="text-gray-600">
                            Average: {studentClass.student_average}% • {studentClass.assessments?.length || 0} assessments
                          </p>
                        </div>
                        <div className={`${color.text} font-semibold`}>{status}</div>
                      </div>
                    );
                  })
                ) : (
                  // Fallback when no classes
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">No classes available</p>
                      <p className="text-gray-500 text-sm">Your schedule will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Latest Polls */}
            <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-[#FF9800]/10 to-[#F57C00]/10 rounded-2xl">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-[#FF9800] to-[#F57C00] rounded-xl">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  Latest Polls
                </h2>
                <div className="space-y-4">
                  {pollsLoading ? (
                    // Loading state
                    <>
                      <div className="flex items-start gap-4 p-6 bg-gray-100 rounded-2xl animate-pulse">
                        <div className="p-3 bg-gray-300 rounded-xl mt-1 w-12 h-12"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-6 bg-gray-100 rounded-2xl animate-pulse">
                        <div className="p-3 bg-gray-300 rounded-xl mt-1 w-12 h-12"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-28 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-36"></div>
                        </div>
                      </div>
                    </>
                  ) : pollsData && pollsData.length > 0 ? (
                    // Real polls from API
                    pollsData.slice(0, 2).map((poll, index) => (
                      <div key={poll.id || index} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg">
                        <div className="p-3 bg-[#25AAE1] rounded-xl mt-1">
                          <Bell className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-bold text-lg">
                            {poll.title || 'Poll Available'}
                          </p>
                          <p className="text-gray-600 mt-1">
                            <span className="font-bold text-[#25AAE1]">
                              {poll.description || 'New poll to complete'}
                            </span>
                          </p>
                          {poll.end_date && (
                            <p className="text-gray-500 text-xs mt-1">
                              Due: {new Date(poll.end_date).toLocaleDateString()}
                            </p>
                          )}
                          <Button
                            size="sm"
                            className="mt-3 bg-[#25AAE1] hover:bg-[#1D8CB3] text-white rounded-xl transition-all duration-300 hover:scale-105"
                            onClick={() => router.push('/student/polls')}
                          >
                            Respond Now
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback when no polls
                    <>
                      <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg">
                        <div className="p-3 bg-[#4CAF50] rounded-xl mt-1">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-bold text-lg">
                            All Caught Up!
                          </p>
                          <p className="text-gray-600 mt-1">
                            <span className="font-bold text-[#4CAF50]">
                              No pending notifications
                            </span>
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 bg-[#4CAF50] hover:bg-[#45A049] text-white rounded-xl transition-all duration-300 hover:scale-105"
                            onClick={() => router.push('/student/assignments')}
                          >
                            View Assignments
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg">
                        <div className="p-3 bg-[#FF9800] rounded-xl mt-1">
                          <Star className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-bold text-lg">
                            Keep Learning
                          </p>
                          <p className="text-gray-600 mt-1">
                            <span className="font-bold text-[#FF9800]">
                              Check your progress
                            </span>
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-xl transition-all duration-300 hover:scale-105"
                            onClick={() => router.push('/student/gradebook')}
                          >
                            View Grades
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            
          </div>
        </div>
      </section>
    </div>
  );
}
