"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { localStorageKey } from "@/constants/global";
import {
  Calendar,
  BookOpen,
  Trophy,
  Clock,
  Star,
  Target,
  GraduationCap,
  Bell,
  TrendingUp,
  Award,
  BookMarked,
  Brain,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Play,
  Users,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get user data from localStorage
  const userData = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(localStorageKey.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = userData?.first_name || userData?.full_name?.split(' ')[0] || "Student";
  const fullName = userData?.full_name || "Student";
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  const quickActions = [
    { icon: Calendar, label: "Attendance", path: "/student/attendance", color: "bg-blue-500" },
    { icon: BookOpen, label: "Assignments", path: "/student/assignments", color: "bg-green-500" },
    { icon: GraduationCap, label: "Grades", path: "/student/gradebook", color: "bg-purple-500" },
    { icon: Brain, label: "AI Tutor", path: "/student/tutor", color: "bg-indigo-500" },
  ];

  const subjects = [
    { name: "Mathematics", grade: "A-", progress: 85, color: "bg-blue-500" },
    { name: "Science", grade: "B+", progress: 78, color: "bg-green-500" },
    { name: "English", grade: "A", progress: 92, color: "bg-purple-500" },
    { name: "History", grade: "B", progress: 70, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-4 ring-blue-100">
                <AvatarImage src={userData?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-500 text-white font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getGreeting()}, {firstName}!</h1>
                <p className="text-gray-600">Let's make today productive</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-gray-600 mt-1">Overall Grade</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <div className="text-3xl font-bold text-green-600">12/15</div>
              <div className="text-sm text-gray-600 mt-1">Assignments</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600">24h</div>
              <div className="text-sm text-gray-600 mt-1">Study Time</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-2xl">
              <div className="text-3xl font-bold text-amber-600">8</div>
              <div className="text-sm text-gray-600 mt-1">Achievements</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(action.path)}
                    className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`p-3 ${action.color} rounded-lg text-white mb-2 group-hover:scale-105 transition-transform`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Subject Progress */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Subject Progress</h2>
                <Button variant="ghost" size="sm" onClick={() => router.push('/student/gradebook')}>
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${subject.color} rounded-full`}></div>
                        <div>
                          <div className="font-medium text-gray-900">{subject.name}</div>
                          <div className="text-sm text-gray-500">Grade: {subject.grade}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{subject.progress}%</div>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Perfect Score!</div>
                    <div className="text-sm text-gray-600">Math Quiz - Yesterday</div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">+100 pts</div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Assignment Streak</div>
                    <div className="text-sm text-gray-600">5 days in a row!</div>
                  </div>
                  <div className="text-sm font-semibold text-blue-600">+50 pts</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Today's Schedule
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Mathematics</div>
                    <div className="text-sm text-gray-600">9:00 - 10:30 AM</div>
                  </div>
                  <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">Now</div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Science Lab</div>
                    <div className="text-sm text-gray-600">11:00 - 12:30 PM</div>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Next</div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">English</div>
                    <div className="text-sm text-gray-600">2:00 - 3:30 PM</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Study Assistant */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Study Assistant
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Math Quiz Tomorrow</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">You need 20 minutes of algebra practice</p>
                  <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    <Play className="h-4 w-4 mr-2" /> Start Practice
                  </Button>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Great Progress!</span>
                  </div>
                  <p className="text-sm text-gray-700">15% improvement in Science this week</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}