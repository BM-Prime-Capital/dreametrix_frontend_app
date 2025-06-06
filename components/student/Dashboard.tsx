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
} from "lucide-react";
import PageTitleH1 from "../ui/page-title-h1";
import { Bell } from "lucide-react";
import StudentProgress from "./StudentProgress";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [username, setUsername] = useState("John Smith");
  const [email, setEmail] = useState("johnsmith@school.edu");
  const [school, setSchool] = useState("School1");
  const router = useRouter();

  return (
    <section className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between text-white">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16 border-4 border-white/20 shadow-lg">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                JS
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, John!</h1>
              <p className="text-blue-100">
                Ready to learn something new today?
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border-white/20 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Instagram className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="flex-1 space-y-6">
          {/* Quick Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-200 to-green-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-green-100 text-sm">Grade Average</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-200 to-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Completed</p>
                  <p className="text-2xl font-bold">12/15</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-200 to-purple-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-purple-100 text-sm">Study Time</p>
                  <p className="text-2xl font-bold">24h</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-200 to-orange-300 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-amber-100 text-sm">Achievements</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6 shadow-lg border-l-4 border-blue-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-300" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                className="h-auto flex-col gap-2 p-4 bg-gradient-to-br from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
                onClick={() => console.log("Navigate to Schedule")}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule</span>
              </Button>
              <Button
                className="h-auto flex-col gap-2 p-4 bg-gradient-to-br from-green-300 to-green-400 hover:from-green-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105"
                onClick={() => console.log("Navigate to Assignments")}
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Assignments</span>
              </Button>
              <Button
                className="h-auto flex-col gap-2 p-4 bg-gradient-to-br from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                onClick={() => console.log("Navigate to Grades")}
              >
                <GraduationCap className="h-6 w-6" />
                <span className="text-sm">Grades</span>
              </Button>
              <Button
                className="h-auto flex-col gap-2 p-4 bg-gradient-to-br from-amber-300 to-orange-300 hover:from-amber-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
                onClick={() => console.log("Navigate to Goals")}
              >
                <Target className="h-6 w-6" />
                <span className="text-sm">Goals</span>
              </Button>
            </div>
          </Card>

          {/* Student Progress Section */}
          <StudentProgress />

          {/* Recent Achievements Section */}
          <Card className="p-6 shadow-lg border-l-4 border-yellow-300 bg-gradient-to-br from-yellow-25 to-amber-25">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                {" "}
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Perfect Score!</p>
                  <p className="text-sm text-gray-600">Math Quiz - Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Star className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Assignment Streak
                  </p>
                  <p className="text-sm text-gray-600">5 days in a row!</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Today's Schedule Quick View */}
          <Card className="p-6 shadow-lg border-l-4 border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              Today's Schedule
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Mathematics</p>
                  <p className="text-sm text-gray-600">
                    9:00 AM - 10:30 AM • Room 204
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Science Lab</p>
                  <p className="text-sm text-gray-600">
                    11:00 AM - 12:30 PM • Lab 1
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    English Literature
                  </p>
                  <p className="text-sm text-gray-600">
                    2:00 PM - 3:30 PM • Room 105
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Enhanced AI Assistance Card */}
          <Card className="p-6 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-amber-300">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Bell className="h-5 w-5 text-amber-600" />
                </div>
                AI Student Assistant
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-200">
                  <div className="p-2 bg-red-100 rounded-full mt-1">
                    <Bell className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium">
                      Exam Alert
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tomorrow:{" "}
                      <span className="font-semibold text-red-400">
                        Class 5 - Math Exam
                      </span>
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 text-xs bg-red-300 hover:bg-red-400 transform hover:scale-105 transition-all duration-200"
                    >
                      Study Now
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-200">
                  <div className="p-2 bg-blue-100 rounded-full mt-1">
                    <Bell className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium">
                      Exam Alert
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tomorrow:{" "}
                      <span className="font-semibold text-blue-400">
                        Class 5 - Science Exam
                      </span>
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 text-xs bg-blue-300 hover:bg-blue-400 transform hover:scale-105 transition-all duration-200"
                    >
                      Study Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Summary Card */}
          <Card className="p-6 shadow-lg border-t-4 border-gradient-to-r from-blue-300 to-purple-300">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-4 mb-6 w-full justify-center">
                <div className="p-3 bg-gradient-to-br from-blue-300 to-purple-400 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Student Profile
                </h2>
              </div>

              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-gradient-to-br from-blue-300 to-purple-300 shadow-lg">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xl font-bold">
                      JS
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 p-1.5 bg-blue-300 rounded-full shadow-lg">
                    <GraduationCap className="h-3 w-3 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {username}
                  </h3>
                  <p className="text-sm text-gray-600">{email}</p>
                  <p className="text-sm text-gray-500">{school}</p>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-300 to-purple-400 hover:from-blue-400 hover:to-purple-500 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
  );
}
