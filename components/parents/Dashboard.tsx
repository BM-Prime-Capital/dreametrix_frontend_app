"use client"

import { ActivityFeed } from "../layout/ActivityFeed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, MessageCircle, Users, Calendar, BookOpen, GraduationCap, Clock, Mail, Phone, Edit2 } from "lucide-react"
import PageTitleH1 from "../ui/page-title-h1"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import StudentClassesDialog from "./StudentClassesDialog"
import {localStorageKey} from "@/constants/global";

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("john")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  })
  
  // Get user data once on component mount
  const [userData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(localStorageKey.USER_DATA) || "{}")
    } catch (error) {
      console.error("Error parsing user data:", error)
      return {}
    }
  })

  // Initialize profile data with user data
  useEffect(() => {
    if (userData && (userData.first_name || userData.last_name || userData.email)) {
      setProfileData({
        fullName: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || ""
      })
    }
  }, []) // Empty dependency array - only run once on mount

  const handleEditProfile = () => {
    setIsEditingProfile(true)
  }

  const handleSaveProfile = () => {
    // Here you would typically save the profile data to the backend
    console.log("Saving profile data:", profileData)
    setIsEditingProfile(false)
  }

  const handleCancelEdit = () => {
    // Reset to original user data
    if (userData && (userData.first_name || userData.last_name || userData.email)) {
      setProfileData({
        fullName: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || ""
      })
    }
    setIsEditingProfile(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Sample children data
  const children = [
    {
      id: "john",
      name: "John Smith",
      grade: "5th Grade",
      avatar: "",
      attendance: "95%",
      gpa: "3.8",
      nextClass: "Mathematics",
      teacher: "Mrs. Johnson",
      studentId:"0366ANH55",
      upcomingEvents: [
        { type: "exam", subject: "Math", date: "Tomorrow", time: "9:00 AM" },
        { type: "conference", subject: "Parent-Teacher", date: "Friday", time: "3:00 PM" },
        { type: "trip", subject: "Field Trip", date: "Next Week", time: "All Day" }
      ]
    },
    {
      id: "emma",
      name: "Emma Smith",
      grade: "3rd Grade",
      avatar: "",
      attendance: "98%",
      gpa: "4.0",
      nextClass: "Science",
      teacher: "Mr. Brown",
      studentId:"0218XYH82",
      upcomingEvents: [
        { type: "exam", subject: "Science", date: "Thursday", time: "10:00 AM" },
        { type: "conference", subject: "Parent-Teacher", date: "Friday", time: "3:00 PM" }
      ]
    },
  ]

  const selectedChildData = children.find((child) => child.id === selectedChild)

  return (
    <section className="flex flex-col gap-6 w-full max-w-full">
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 sm:px-6 py-4 rounded-lg shadow-sm">
        <PageTitleH1 title="Parent Dashboard" className="text-white font-semibold"/>
        <div className="flex items-center gap-2">
          <span className="text-white/90 text-sm flex items-center">
            Welcome back, {userData.full_name.split(' ')[0]}
            <span className="ml-2 animate-waving-hand">👋</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-2 sm:p-4">
        <div className="flex-1 space-y-6 min-w-0">
          {/* Profile Header Card */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-16 w-16 shrink-0">
                <AvatarImage src="/placeholder.svg"/>
                <AvatarFallback>{userData?.first_name?.charAt(0)}{userData?.last_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h2 className="text-xl font-medium truncate">{userData.first_name} {userData.last_name}</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <MessageCircle className="h-5 w-5 text-[#25AAE1]" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <Users className="h-5 w-5 text-[#25AAE1]" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="truncate">{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="truncate">(555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Child Information Card */}
          {selectedChildData && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-gray-700">Child Information</h2>
                  <div className="w-[200px]">
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select child" />
                      </SelectTrigger>
                      <SelectContent>
                        {children.map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            {child.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <StudentClassesDialog studentName={selectedChildData.name} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 shrink-0">
                    <AvatarImage src={selectedChildData.avatar} />
                    <AvatarFallback>{selectedChildData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-medium truncate">{selectedChildData.name}</h3>
                    <p className="text-sm text-gray-500">{selectedChildData.grade}</p>
                    <p className="text-sm text-gray-500">ID: {selectedChildData.studentId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <GraduationCap className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">GPA</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">{selectedChildData.gpa}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">Attendance</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">{selectedChildData.attendance}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span className="font-medium">Next Class</span>
                  </div>
                  <p className="text-lg truncate">{selectedChildData.nextClass}</p>
                  <p className="text-sm text-gray-500 truncate">with {selectedChildData.teacher}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span className="font-medium">Current Schedule</span>
                  </div>
                  <Button variant="ghost" className="text-[#25AAE1] p-0 h-auto">
                    View Full Schedule
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Card */}
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-gray-700">Upcoming Events & Reminders</h2>
                <Button variant="ghost" size="sm" className="text-[#25AAE1]">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {selectedChildData?.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="mt-1">
                      <Bell className="h-5 w-5 text-amber-400 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {event.type === 'exam' ? `${event.subject} Exam` :
                         event.type === 'conference' ? 'Parent-Teacher Conference' :
                         'Field Trip'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Profile Edit Card */}
          <Card className="p-4">
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-between w-full mb-6">
                <h2 className="text-xl font-semibold">Parent Profile</h2>
                {!isEditingProfile && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#25AAE1]"
                    onClick={handleEditProfile}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="flex flex-col items-center gap-2 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{userData?.first_name?.charAt(0)}{userData?.last_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditingProfile && (
                  <span className="text-sm text-[#25AAE1] cursor-pointer hover:text-[#1E86B3]">Change Photo</span>
                )}
              </div>

              <div className="w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="fullName">
                      Full Name
                    </label>
                    <Input 
                      id="fullName" 
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Parent Smith" 
                      className="bg-gray-50 h-11"
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <Input 
                      id="email" 
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="parent.smith@example.com" 
                      className="bg-gray-50 h-11"
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="phone">
                      Phone
                    </label>
                    <Input 
                      id="phone" 
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567" 
                      className="bg-gray-50 h-11"
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="address">
                      Address
                    </label>
                    <Input 
                      id="address" 
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main St, City" 
                      className="bg-gray-50 h-11"
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="pt-4 space-y-3">
                    <Button 
                      className="w-full bg-[#25AAE1] hover:bg-[#1E86B3] h-11 text-base"
                      onClick={handleSaveProfile}
                    >
                      SAVE CHANGES
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-muted-foreground hover:text-foreground"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="w-full lg:w-80 shrink-0">
          <ActivityFeed />
        </div>
      </div>
    </section>
  )
}
