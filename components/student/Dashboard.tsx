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
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [username, setUsername] = useState("John Smith");
  const [email, setEmail] = useState("johnsmith@school.edu");
  const [school, setSchool] = useState("School1");
  const router = useRouter();

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
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center border-2 border-white">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
                <p className="text-white/90 text-lg">
                  Ready to learn something new today?
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <BookMarked className="h-4 w-4" />
                    <span className="text-sm">Grade 5</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">Top Student</span>
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
                  3
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
                    <p className="text-3xl font-bold">85%</p>
                    <p className="text-white/70 text-xs">+2.5% this week</p>
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
                    <p className="text-3xl font-bold">12/15</p>
                    <p className="text-white/70 text-xs">80% completed</p>
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
                    <p className="text-3xl font-bold">24h</p>
                    <p className="text-white/70 text-xs">This month</p>
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
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-white/70 text-xs">+2 this week</p>
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
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#4CAF50]/10 to-[#45A049]/10 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="p-4 bg-[#4CAF50] rounded-xl">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Perfect Score!</p>
                    <p className="text-gray-600">Math Quiz - Yesterday</p>
                    <p className="text-[#4CAF50] text-sm font-semibold">+100 points</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#25AAE1]/10 to-[#1D8CB3]/10 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="p-4 bg-[#25AAE1] rounded-xl">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Assignment Streak</p>
                    <p className="text-gray-600">5 days in a row!</p>
                    <p className="text-[#25AAE1] text-sm font-semibold">+50 points</p>
                  </div>
                </div>
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
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#25AAE1]/10 to-[#1D8CB3]/10 rounded-xl hover:shadow-md transition-all duration-200">
                  <div className="w-4 h-4 bg-[#25AAE1] rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Mathematics</p>
                    <p className="text-gray-600">
                      9:00 AM - 10:30 AM • Room 204
                    </p>
                  </div>
                  <div className="text-[#25AAE1] font-semibold">Now</div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#4CAF50]/10 to-[#45A049]/10 rounded-xl hover:shadow-md transition-all duration-200">
                  <div className="w-4 h-4 bg-[#4CAF50] rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Science Lab</p>
                    <p className="text-gray-600">
                      11:00 AM - 12:30 PM • Lab 1
                    </p>
                  </div>
                  <div className="text-[#4CAF50] font-semibold">Next</div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#25AAE1]/10 to-[#1D8CB3]/10 rounded-xl hover:shadow-md transition-all duration-200">
                  <div className="w-4 h-4 bg-[#25AAE1] rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">English Literature</p>
                    <p className="text-gray-600">
                      2:00 PM - 3:30 PM • Room 105
                    </p>
                  </div>
                  <div className="text-[#25AAE1] font-semibold">Later</div>
                </div>
              </div>
            </Card>

            {/* AI Assistant Moderne */}
            <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-[#FF9800]/10 to-[#F57C00]/10 rounded-2xl">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-[#FF9800] to-[#F57C00] rounded-xl">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  AI Student Assistant
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-[#FF5252]">
                    <div className="p-3 bg-[#FF5252] rounded-xl mt-1">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-bold text-lg">
                        Exam Alert
                      </p>
                      <p className="text-gray-600 mt-1">
                        Tomorrow:{" "}
                        <span className="font-bold text-[#FF5252]">
                          Class 5 - Math Exam
                        </span>
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 bg-[#FF5252] hover:bg-[#D32F2F] text-white rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        Study Now
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-[#25AAE1]">
                    <div className="p-3 bg-[#25AAE1] rounded-xl mt-1">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-bold text-lg">
                        Assignment Due
                      </p>
                      <p className="text-gray-600 mt-1">
                        Today:{" "}
                        <span className="font-bold text-[#25AAE1]">
                          Science Project
                        </span>
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 bg-[#25AAE1] hover:bg-[#1D8CB3] text-white rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        Submit Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Summary Card Moderne */}
            <Card className="p-8 shadow-xl border-0 bg-white rounded-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-4 mb-8 w-full justify-center">
                  <div className="p-4 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Student Profile
                  </h2>
                </div>

                <div className="flex flex-col items-center gap-6 mb-8">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-gradient-to-r from-[#25AAE1] to-[#1D8CB3] shadow-xl">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white">
                        JS
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 p-2 bg-[#4CAF50] rounded-full shadow-lg">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-xl text-gray-800">
                      {username}
                    </h3>
                    <p className="text-gray-600">{email}</p>
                    <p className="text-gray-500">{school}</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#25AAE1] h-14 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                  onClick={() => {
                    router.push("/student/profile");
                  }}
                >
                  EDIT PROFILE
                </Button>
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
