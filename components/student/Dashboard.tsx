"use client";

import { ActivityFeed } from "../layout/ActivityFeed";
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
} from "lucide-react";
import PageTitleH1 from "../ui/page-title-h1";
import StudentProgress from "./StudentProgress";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/app/utils/getUserFullName";
import { localStorageKey } from "@/constants/global";
import { getStudentClasses, StudentClass } from "@/services/StudentGradebookService";
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
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<StudentAttendanceData | null>(null);
  const [rewardsData, setRewardsData] = useState<StudentRewardsData | null>(null);
  const [pollsData, setPollsData] = useState<any[]>([]);
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
      loadGradesData();
      loadAssignmentsData();
      loadAttendanceData();
      loadRewardsData();
      loadPollsData();
    }
  }, [requestInfoLoading, tenantDomain, accessToken]);

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
    if (assignments.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    // Assuming assignments have a status or completed field
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
    if (!attendanceData || !attendanceData.summary) {
      return "0h";
    }
    
    // Calculate estimated study time based on present days
    // Assuming 6 hours per school day
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
            <div className="flex gap-3">
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
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
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
                      {gradesLoading ? "--" : `${calculateOverallAverage(studentClasses)}%`}
                    </p>
                    <p className="text-white/70 text-xs">
                      {studentClasses.length} {studentClasses.length === 1 ? 'class' : 'classes'}
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
                      {assignmentsLoading ? "--" : `${getAssignmentStats().completed}/${getAssignmentStats().total}`}
                    </p>
                    <p className="text-white/70 text-xs">
                      {assignmentsLoading ? "Loading..." : `${getAssignmentStats().percentage}% completed`}
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
                      {attendanceData ? `${attendanceData.summary?.attendance_rate || 0}% attendance` : "This month"}
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
            <StudentProgress />

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
                {gradesLoading ? (
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
                ) : studentClasses && studentClasses.length > 0 ? (
                  // Real classes from API
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
                      <div key={poll.id || index} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-[#25AAE1]">
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
                      <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-[#4CAF50]">
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
                      <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-[#FF9800]">
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

          {/* Activity Feed */}
          <ActivityFeed />
        </div>
      </section>
    </div>
  );
}
