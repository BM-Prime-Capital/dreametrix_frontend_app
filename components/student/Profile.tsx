"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTitleH1 from "@/components/ui/page-title-h1";
import {
  GraduationCap,
  MessageCircle,
  BookOpen,
  Star,
  ArrowLeft,
} from "lucide-react";

export default function StudentProfile() {
  const [username, setUsername] = useState("John Smith");
  const [email, setEmail] = useState("johnsmith@school.edu");
  const [school, setSchool] = useState("School1");

  const handleUpdateProfile = () => {
    // Handle profile update logic here
    console.log("Profile updated:", { username, email, school });
  };

  return (
    <section className="flex flex-col gap-6 w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PageTitleH1 title="STUDENT PROFILE" className="text-white" />
        </div>
      </div>

      <div className="flex justify-center p-4 sm:p-6">
        {/* Enhanced Profile Edit Card */}
        <Card className="p-6 shadow-lg border-t-4 border-gradient-to-r from-blue-500 to-purple-500 w-full max-w-4xl">
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center gap-4 mb-6 w-full justify-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Edit Profile Information
              </h2>
            </div>

            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-gradient-to-br from-blue-400 to-purple-500 shadow-lg">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl font-bold">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 p-3 bg-blue-500 rounded-full shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
              >
                Change Photo
              </Button>
            </div>

            <div className="w-full px-4 sm:px-8 md:px-12 space-y-8 max-w-3xl">
              {/* Personal Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      Username
                    </label>
                    <Input
                      id="username"
                      placeholder="John Smith"
                      className="bg-white h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 text-base"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="johnsmith@school.edu"
                      className="bg-white h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Academic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-500" />
                      School
                    </label>
                    <Input
                      id="school"
                      placeholder="School1"
                      className="bg-white h-12 border-gray-200 focus:border-green-400 focus:ring-green-400 text-base"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-500" />
                      Role
                    </label>
                    <Input
                      id="role"
                      placeholder="Student"
                      className="bg-gray-100 h-12 border-gray-200 text-base"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  Additional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Grade Level
                    </label>
                    <Input
                      id="grade"
                      placeholder="Grade 10"
                      className="bg-white h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Student ID
                    </label>
                    <Input
                      id="studentId"
                      placeholder="STU001234"
                      className="bg-white h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-4">
                <Button
                  onClick={handleUpdateProfile}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  UPDATE PROFILE
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-700 hover:bg-gray-50 h-12 text-base"
                  onClick={() => window.history.back()}
                >
                  Cancel Changes
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
