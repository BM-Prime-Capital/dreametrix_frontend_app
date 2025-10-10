"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
//import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ParentClassesTable } from "@/components/parents/ParentClassesTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Loader2, AlertCircle, BookOpen, Users, TrendingUp, Award, Calendar } from "lucide-react"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { getParentClasses, ParentClass } from "@/services/ParentClassService"
import { menuImages } from "@/constants/images"
import Image from "next/image"
import { useLoading } from "@/lib/LoadingContext"

export default function ParentClassesPage() {
  const { accessToken, refreshToken } = useRequestInfo()
  const { stopLoading } = useLoading()
  const [selectedChild, setSelectedChild] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  //const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  //const [isProgramsModalOpen, setIsProgramsModalOpen] = useState(false)
  const [classes, setClasses] = useState<ParentClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Safety: ensure loading stops when component unmounts
  useEffect(() => {
    return () => {
      stopLoading()
    }
  }, [stopLoading])

  // Fetch classes data
  const fetchClassesData = async () => {
    if (!accessToken) {
      stopLoading()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getParentClasses(accessToken)
      setClasses(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error loading classes data")
    } finally {
      setLoading(false)
      stopLoading() // Always stop global loading
    }
  }

  useEffect(() => {
    fetchClassesData()
  }, [accessToken, refreshToken])

  const handleRefresh = () => {
    setLoading(true) // Set loading to true for refresh
    fetchClassesData()
  }

  // Extract unique subjects from classes
  const subjects = classes.map(cls => ({
    id: cls.subject,
    name: cls.subject
  })).filter((subject, index, self) => 
    self.findIndex(s => s.id === subject.id) === index
  )

  // Extract unique levels (grades) from classes
  const levels = classes.map(cls => ({
    id: cls.level,
    name: `Grade ${cls.level}`
  })).filter((level, index, self) => 
    self.findIndex(l => l.id === level.id) === index
  )

  // Extract unique children from classes
  const children = classes.flatMap(cls => 
    cls.students.map(student => ({
      id: student.id,
      name: `${student.first_name} ${student.last_name}`
    }))
  ).filter((child, index, self) => 
    self.findIndex(c => c.id === child.id) === index
  )

  // Calculer les statistiques globales
  const totalClasses = classes.length
  const totalStudents = children.length
  const totalSubjects = subjects.length
  // const totalTeachers = classes.map(cls => `${cls.teacher.first_name} ${cls.teacher.last_name}`)
  //   .filter((teacher, index, self) => self.indexOf(teacher) === index).length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading classes data...</p>
        <p className="text-gray-500 text-sm mt-2">Analyzing academic programs and schedules</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-3xl border border-red-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 font-medium text-center mb-6">{error}</p>
            <Button
              onClick={fetchClassesData}
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#25AAE1] via-[#1D8CB3] to-[#1453B8] p-6 rounded-2xl text-white shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
              <Image 
                src={menuImages.classes} 
                alt="Classes" 
                width={32} 
                height={32} 
                className="w-8 h-8 brightness-0 invert"
              />
              Classes Dashboard
            </h1>
            <p className="text-blue-100 text-base">Monitor your children&apos;s academic programs and class schedules</p>
          </div>
          {/* <div className="flex gap-2">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Schedule
            </Button>
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Programs
            </Button>
          </div> */}
        </div>

        {/* Parent Code Display */}
        {/* <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-200" />
            <span className="text-blue-200 text-sm">Parent&apos;s Code:</span>
            <span className="text-white font-mono font-bold text-lg">8787NK920</span>
          </div>
        </div> */}

        {/* Filters and Stats */}
        <div className="flex pt-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Classes</span>
              </div>
              <h3 className="text-lg font-bold">{totalClasses}</h3>
              <p className="text-blue-100 text-sm">Total Classes</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Students</span>
              </div>
              <h3 className="text-lg font-bold">{totalStudents}</h3>
              <p className="text-blue-100 text-sm">Total Children</p>
            </div>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-xs">Subjects</span>
              </div>
              <h3 className="text-lg font-bold">{totalSubjects}</h3>
              <p className="text-blue-100 text-sm">Total Subjects</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                <SelectValue placeholder="All Children"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Children ({children.length})</SelectItem>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id.toString()}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                <SelectValue placeholder="All Subjects"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                <SelectValue placeholder="All Levels"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Classes Table */}
      <Card className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Image 
              src={menuImages.classes} 
              alt="Classes" 
              width={20} 
              height={20} 
              className="w-5 h-5"
            />
            Classes Overview
          </h2>
          <p className="text-gray-600 text-sm mt-1">Detailed view of your children&apos;s academic programs and class schedules</p>
        </div>
        <ParentClassesTable 
          selectedChild={selectedChild}
          selectedSubject={selectedSubject}
          selectedLevel={selectedLevel}
          classes={classes}
        />
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>
    </div>
  )
}
