"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Filter, Calendar, Clock, Users } from "lucide-react"
import { StudentClassesTable } from "@/components/student/classes/student-classes-table"

export default function ClassesPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all-subjects")
  const [selectedDay, setSelectedDay] = useState<string>("all-days")
  const [searchQuery, setSearchQuery] = useState<string>("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
                <p className="text-gray-600 mt-1">View your enrolled classes and schedules</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-sm text-gray-500">Total Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-gray-500">Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">25h</div>
                <div className="text-sm text-gray-500">This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              Filter Classes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-gray-200"
              />
            </div>
            
            {/* Subject Filter */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="rounded-xl border-gray-200">
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
            
            {/* Day Filter */}
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder="All Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-days">All Days</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedSubject("all-subjects")
                setSelectedDay("all-days")
                setSearchQuery("")
              }}
              className="rounded-xl"
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Classes Table */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-xl font-bold">Class Schedule</h2>
                <p className="text-white/80 text-sm">Your weekly class timetable</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Week of Nov 18-22</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <StudentClassesTable />
          </div>
        </Card>
      </div>
    </div>
  )
}
