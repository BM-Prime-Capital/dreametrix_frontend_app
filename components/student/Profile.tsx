"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  School,
  User,
  Calendar,
  MapPin,
  Phone,
  Shield,
  Camera,
  ArrowLeft,
  Save,
  RotateCcw,
  CheckCircle,
  Award,
  BookOpen,
  Target
} from "lucide-react";

export default function StudentProfile() {
  const [username, setUsername] = useState("John Smith");
  const [email, setEmail] = useState("johnsmith@school.edu");
  const [school, setSchool] = useState("School1");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [address, setAddress] = useState("123 Main St, City, State 12345");
  const [grade, setGrade] = useState("Grade 10");
  const [studentId, setStudentId] = useState("STU001234");
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleUpdateProfile = () => {
    // Handle profile update logic here
    console.log("Profile updated:", { username, email, school });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form values if needed
  };

  const stats = [
    { icon: BookOpen, label: "Courses", value: "8", color: "from-blue-500 to-cyan-500" },
    { icon: Award, label: "Achievements", value: "12", color: "from-purple-500 to-pink-500" },
    { icon: Target, label: "Goals", value: "5", color: "from-green-500 to-emerald-500" },
    { icon: CheckCircle, label: "Completed", value: "89%", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header avec le même style que le dashboard */}
      <div className="rounded-2xl p-8 mx-4 mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                STUDENT PROFILE
              </h1>
              <p className="text-blue-100 text-lg opacity-90">
                Manage your personal and academic information
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white/30 shadow-2xl">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-white/20 text-xl font-bold text-white">
                JS
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="p-6 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information Card */}
            <div className="lg:col-span-2">
              <Card className="p-8 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <p className="text-gray-600">Update your personal details</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`rounded-xl transition-all duration-300 ${
                      isEditing 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-8">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-2xl">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          JS
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full p-2 bg-white border shadow-lg hover:shadow-xl"
                        >
                          <Camera className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{username}</h3>
                      <p className="text-gray-600 mb-1 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {email}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <School className="h-4 w-4" />
                        {school} • {grade}
                      </p>
                    </div>
                  </div>

                  {/* Form Sections */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Personal Details
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Full Name
                          </label>
                          <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={!isEditing}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Phone Number
                          </label>
                          <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={!isEditing}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                        Academic Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            School
                          </label>
                          <Input
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            disabled={!isEditing}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-green-400 focus:ring-green-400"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Grade Level
                          </label>
                          <Input
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            disabled={!isEditing}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-green-400 focus:ring-green-400"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Student ID
                          </label>
                          <Input
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            disabled={!isEditing}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-green-400 focus:ring-green-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      Additional Information
                    </h3>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Address
                      </label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={!isEditing}
                        className="h-12 rounded-xl border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <Button
                        onClick={handleUpdateProfile}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="flex-1 h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-300"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar - Quick Info */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card className="p-6 rounded-2xl border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Account Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Verified</span>
                    <CheckCircle className="h-5 w-5 text-green-300" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Active</span>
                    <CheckCircle className="h-5 w-5 text-green-300" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Member Since</span>
                    <span className="text-blue-100">2024</span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: BookOpen, label: "View Grades", action: () => router.push("/student/gradebook") },
                    { icon: Award, label: "Achievements", action: () => router.push("/student/rewards") },
                    { icon: Calendar, label: "Attendance", action: () => router.push("/student/attendance") },
                    { icon: Target, label: "Set Goals", action: () => console.log("Set Goals") }
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={action.action}
                      className="w-full justify-start p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                    >
                      <action.icon className="h-4 w-4 mr-3" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}