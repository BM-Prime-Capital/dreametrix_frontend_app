"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, ArrowLeft, Users, Clock, GraduationCap } from "lucide-react"
import { StudentClassesTable } from "@/components/student/classes/student-classes-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function ClassesPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all-subjects")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const [stats, setStats] = useState({
    totalClasses: 0,
    todayClasses: 0,
    totalTeachers: 0,
    activeSubjects: 0
  })

  // Simulate initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleStatsUpdate = (newStats: {
    totalClasses: number;
    todayClasses: number;
    totalTeachers: number;
    activeSubjects: number;
  }) => {
    setStats(newStats);
  };

  const handleSubjectChange = (value: string) => {
    setIsFilterLoading(true);
    setSelectedSubject(value);
    
    // Simulate filter loading
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
              CLASSES
            </h1>
            <p className="text-white/80 text-sm">View your enrolled classes and schedules</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">My Classes</h2>
              <p className="text-gray-600 text-sm">Manage your class schedule and information</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedSubject} onValueChange={handleSubjectChange} disabled={isFilterLoading}>
              <SelectTrigger className={`w-[200px] bg-white border-2 border-[#25AAE1] rounded-xl shadow-md transition-all duration-200 ${isFilterLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-subjects">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="english">English Literature</SelectItem>
                <SelectItem value="history">World History</SelectItem>
              </SelectContent>
            </Select>
            {isFilterLoading && (
              <div className="flex items-center text-[#25AAE1] text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#25AAE1] mr-2"></div>
                Filtering...
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {isInitialLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="p-6 rounded-2xl shadow-xl border-0">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">Total Classes</p>
                  <p className="text-3xl font-bold">{stats.totalClasses}</p>
                  <p className="text-white/70 text-xs">Enrolled courses</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Clock className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">Today's Classes</p>
                  <p className="text-3xl font-bold">{stats.todayClasses}</p>
                  <p className="text-white/70 text-xs">Scheduled today</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">Teachers</p>
                  <p className="text-3xl font-bold">{stats.totalTeachers}</p>
                  <p className="text-white/70 text-xs">Instructors</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">Subjects</p>
                  <p className="text-3xl font-bold">{stats.activeSubjects}</p>
                  <p className="text-white/70 text-xs">Active subjects</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Table avec design moderne */}
        <Card className="rounded-2xl shadow-xl p-0 overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Class Schedule</h2>
          </div>
          <div className="p-6">
            <StudentClassesTable 
              onStatsUpdate={handleStatsUpdate} 
              selectedSubject={selectedSubject}
              isFilterLoading={isFilterLoading}
            />
          </div>
        </Card>
      </section>
    </div>
  )
}
