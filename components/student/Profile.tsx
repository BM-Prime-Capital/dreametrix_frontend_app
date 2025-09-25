/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  GraduationCap,
  BookOpen,
  ArrowLeft,
  User,
  Home,
  Mail,
  Users,
  Clipboard,
  MessageSquare,
  MapPin,
  Calendar,
  Bookmark,
  Award,
  BarChart3,
  ShieldQuestion,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { confirmParentLink } from "@/services/student-service";
import { getStudentProfileInfo } from "@/services/admin-service";

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string | null;
  role: string;
  country: string;
  city: string | null;
  address: string | null;
  zip_code: string | null;
  age: number | null;
  bio: string | null;
  picture: string | null;
  date_joined: string;
}

interface ProfileData {
  id: number;
  bio: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  medical_conditions: string | null;
  allergies: string | null;
  created_at: string;
  updated_at: string;
}

interface StudentProfileResponse {
  success: boolean;
  data: {
    user: UserData;
    profile: ProfileData;
  };
  editable_fields: {
    user_fields: string[];
    profile_fields: string[];
  };
}

export default function StudentProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [studentData, setStudentData] = useState<StudentProfileResponse | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { tenantDomain, accessToken } = useRequestInfo();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("School1"); 
  const [grade, setGrade] = useState("Grade 10"); 
  const [studentId, setStudentId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");

  const url = `${tenantDomain}/parents/confirm-link/`;

  useEffect(() => {
    const getStudentProfile = async () => {
      try {
        setIsLoading(true);
        const result = await getStudentProfileInfo(accessToken, tenantDomain);
        console.log("getStudentProfileInfo", result);
        
        if (result.success && result.data) {
          setStudentData(result.data);
          const user = result.data.user;
          setUsername(user.full_name);
          setEmail(user.email);
          setStudentId(`STU${user.id.toString().padStart(6, '0')}`);
          setAddress(user.address || "Address not provided");
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (accessToken && tenantDomain) {
      getStudentProfile();
    }
  }, [accessToken, tenantDomain]);

  const courses = [
    { name: "Mathematics", grade: "A", teacher: "Mr. Johnson" },
    { name: "English Literature", grade: "B+", teacher: "Mrs. Williams" },
    { name: "Physics", grade: "A-", teacher: "Dr. Davis" },
    { name: "History", grade: "B", teacher: "Ms. Anderson" },
  ];

  const performance = {
    attendance: "96%",
    assignmentsCompleted: "42/45",
    averageGrade: "B+",
  };

  const [parents] = useState([
    {
      id: 1,
      name: "Michael Smith",
      email: "michael.smith@example.com",
      phone: "+1 (555) 123-4567",
      relation: "Father",
      status: "confirmed",
      confirmedAt: "2023-09-15",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@example.com",
      phone: "+1 (555) 987-6543",
      relation: "Mother",
      status: "pending",
      requestedAt: "2023-10-20",
    },
  ]);

  const openConfirmationModal = (parent: any) => {
    setSelectedParent(parent);
    setIsConfirmationModalOpen(true);
  };

  const confirmParent = async () => {
    setIsConfirming(true);
    try {
      const result = await confirmParentLink(url, selectedParent?.id, accessToken);
      if (result.success) {
        alert(`${selectedParent.name} has been confirmed as your ${selectedParent.relation.toLowerCase()}.`);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Confirmation error:", error);
      alert("An error occurred while confirming the parent. Please try again.");
    } finally {
      setIsConfirming(false);
      setIsConfirmationModalOpen(false);
      setSelectedParent(null);
    }
  };

  const SkeletonAvatar = () => (
    <div className="flex items-center">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="ml-6 space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <Card className="p-6 border-gray-200">
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </Card>
  );

  const SkeletonTabContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Header Skeleton */}
        <div className="bg-white py-6 rounded-b-lg shadow-sm border-b">
          <div className="w-full mx-auto px-4 sm:px-6">
            <div className="mb-6 flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <SkeletonAvatar />
          </div>
        </div>

        {/* Body Skeleton */}
        <div className="mt-8 mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="mb-6 bg-white rounded-t-lg p-4">
            <div className="flex space-x-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-b-lg shadow-sm border">
            <SkeletonTabContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Confirmation Modal */}
      {isConfirmationModalOpen && selectedParent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Parent</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to confirm that {selectedParent.name} is your {selectedParent.relation.toLowerCase()}?
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirmationModalOpen(false)}
                className="text-gray-700 hover:text-gray-800"
                disabled={isConfirming}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmParent}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isConfirming}
              >
                {isConfirming ? "Confirming..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white py-6 rounded-b-lg shadow-sm border-b">
        <div className="w-full mx-auto px-4 sm:px-6">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </button>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 flex items-center transition-colors">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={studentData?.data.user.picture || "/placeholder.svg"} />
                  <AvatarFallback className="text-xl font-bold bg-blue-100 text-blue-600">
                    {studentData?.data.user.first_name?.[0]}{studentData?.data.user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 p-2 bg-blue-500 rounded-full shadow-lg">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {studentData?.data.user.full_name || username}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-gray-600">{grade} Student</span>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
            
            <div></div>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="mt-8 mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-gray-200 bg-white rounded-t-lg p-4">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <User className="mr-2 h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'academic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Academic
            </button>
            <button
              onClick={() => setActiveTab('parents')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'parents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Users className="mr-2 h-4 w-4" />
              Parents
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'personal' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Clipboard className="mr-2 h-4 w-4" />
              Personal Info
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-b-lg shadow-sm border">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <Card className="p-6 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="text-gray-400 mr-2 h-5 w-5" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium">{studentData?.data.user.email || email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="text-sm font-medium">{studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Joined</p>
                    <p className="text-sm font-medium">
                      {new Date(studentData?.data.user.date_joined || "").toLocaleDateString()}
                    </p>
                  </div>
                  {studentData?.data.user.phone_number && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{studentData.data.user.phone_number}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Academic Summary Card */}
              <Card className="p-6 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="text-gray-400 mr-2 h-5 w-5" />
                  Academic Summary
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">School</p>
                    <p className="text-sm font-medium">{school}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="text-sm font-medium">{grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Overall GPA</p>
                    <p className="text-sm font-medium">3.6</p>
                  </div>
                </div>
              </Card>

              {/* Performance Card */}
              <Card className="p-6 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="text-gray-400 mr-2 h-5 w-5" />
                  Performance
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Attendance</p>
                    <p className="text-xl font-semibold text-green-600">{performance.attendance}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Assignments</p>
                    <p className="text-xl font-semibold">{performance.assignmentsCompleted}</p>
                  </div>
                  <div className="text-center col-span-2">
                    <p className="text-sm text-gray-500">Average Grade</p>
                    <p className="text-xl font-semibold text-blue-600">{performance.averageGrade}</p>
                  </div>
                </div>
              </Card>

              {/* Address Card */}
              <Card className="p-6 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Home className="text-gray-400 mr-2 h-5 w-5" />
                  Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">
                      {studentData?.data.user.address || address || "Address not provided"}
                    </p>
                  </div>
                  {studentData?.data.user.address && (
                    <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      View on Map
                    </button>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course, index) => (
                    <Card key={index} className="p-4 border-gray-200 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{course.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Teacher: {course.teacher}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.grade === 'A' || course.grade === 'A-' ? 'bg-green-100 text-green-800' : 
                          course.grade.includes('B') ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.grade}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Academic Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center border-gray-200">
                    <p className="text-sm text-gray-500">Overall GPA</p>
                    <p className="text-2xl font-semibold text-blue-600">3.6</p>
                  </Card>
                  <Card className="p-4 text-center border-gray-200">
                    <p className="text-sm text-gray-500">Attendance Rate</p>
                    <p className="text-2xl font-semibold text-green-600">96%</p>
                  </Card>
                  <Card className="p-4 text-center border-gray-200">
                    <p className="text-sm text-gray-500">Assignments Completed</p>
                    <p className="text-2xl font-semibold">42/45</p>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Parents Tab */}
          {activeTab === 'parents' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Parent Information
                </h2>
                <p className="text-gray-600 mb-6">
                  These are the parents linked to your account. Please confirm that they are your actual parents.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parents.map((parent) => (
                    <Card key={parent.id} className="p-6 border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-medium text-gray-900">{parent.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          parent.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {parent.status === 'confirmed' ? 'Confirmed' : 'Pending Confirmation'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Relation</p>
                          <p className="text-sm font-medium">{parent.relation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-sm font-medium">{parent.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-sm font-medium">{parent.phone}</p>
                        </div>
                        {parent.status === 'confirmed' ? (
                          <div className="flex items-center text-green-600 text-sm mt-4">
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            Confirmed on {new Date(parent.confirmedAt).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-600 text-sm mt-4">
                            <ShieldQuestion className="h-4 w-4 mr-1" />
                            Requested on {new Date(parent?.requestedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      {parent.status !== 'confirmed' && (
                        <div className="mt-6">
                          <Button 
                            onClick={() => openConfirmationModal(parent)}
                            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Confirm Parent
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
              
              <Card className="p-6 border-blue-200 bg-blue-50">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Parent Verification
                </h3>
                <p className="text-blue-700 text-sm">
                  For security purposes, please verify that the parents listed above are your actual parents. 
                  This ensures that only authorized individuals have access to your academic information.
                </p>
              </Card>
            </div>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="text-gray-400 mr-2 h-5 w-5" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Full Name
                    </label>
                    <Input
                      id="username"
                      placeholder="John Smith"
                      className="bg-white h-12 border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                      value={studentData?.data.user.full_name || username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="johnsmith@school.edu"
                      className="bg-white h-12 border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                      value={studentData?.data.user.email || email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-500" />
                      School
                    </label>
                    <Input
                      id="school"
                      placeholder="School1"
                      className="bg-white h-12 border-gray-300 focus:border-green-400 focus:ring-green-400"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-500" />
                      Grade Level
                    </label>
                    <Input
                      id="grade"
                      placeholder="Grade 10"
                      className="bg-white h-12 border-gray-300 focus:border-green-400 focus:ring-green-400"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-purple-500" />
                      Student ID
                    </label>
                    <Input
                      id="studentId"
                      placeholder="STU001234"
                      className="bg-white h-12 border-gray-300 focus:border-purple-400 focus:ring-purple-400"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      Date Joined
                    </label>
                    <Input
                      id="dateJoined"
                      className="bg-white h-12 border-gray-300 focus:border-purple-400 focus:ring-purple-400"
                      value={new Date(studentData?.data.user.date_joined || "").toLocaleDateString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Home className="h-4 w-4 text-purple-500" />
                      Address
                    </label>
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      className="bg-white h-12 border-gray-300 focus:border-purple-400 focus:ring-purple-400"
                      value={studentData?.data.user.address || address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  {studentData?.data.user.phone_number && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        placeholder="Phone number"
                        className="bg-white h-12 border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                        value={studentData.data.user.phone_number}
                        onChange={(e) => {}}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}