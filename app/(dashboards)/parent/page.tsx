"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Users,
  BookOpen,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Minus,
  XCircle,
  Award,
  Heart,
  Clock,
  Calendar,
  FileText,
  Eye
} from "lucide-react"
import { useParentDashboard } from "@/hooks/useParentDashboard"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import Link from "next/link"

export default function ParentDashboardPage() {
  const { accessToken } = useRequestInfo()
  const {
    parentInfo,
    studentsSummary,
    quickStats,
    dashboardData,
    loading,
    error,
    hasStudents,
    allPresentToday,
    studentsCount,
    isMockMode
  } = useParentDashboard(accessToken)

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!hasStudents) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Students Linked</h3>
            <p className="text-gray-600">Please link a student to view dashboard data.</p>
          </div>
        </Card>
      </div>
    )
  }

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "late":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getAttendanceBadgeClass = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200"
      case "absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "late":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "grade":
        return <BookOpen className="h-4 w-4" />
      case "assignment":
        return <FileText className="h-4 w-4" />
      case "reward":
        return <Award className="h-4 w-4" />
      case "character":
        return <Heart className="h-4 w-4" />
      case "attendance":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "grade":
        return "bg-blue-100 text-blue-600"
      case "assignment":
        return "bg-purple-100 text-purple-600"
      case "reward":
        return "bg-yellow-100 text-yellow-600"
      case "character":
        return "bg-pink-100 text-pink-600"
      case "attendance":
        return "bg-green-100 text-green-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return "Just now"
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {parentInfo?.full_name || "Parent"}
            </h1>
            <p className="text-gray-600">
              Here&apos;s an overview of your {studentsCount === 1 ? "child&apos;s" : "children&apos;s"} progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isMockMode && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 font-medium">
                DEMO MODE
              </Badge>
            )}
            {allPresentToday && (
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                All Present Today
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        {quickStats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{quickStats.total_students}</p>
                  <p className="text-xs text-gray-600">Students</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{quickStats.average_attendance_rate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">Attendance</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{quickStats.average_grade.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">Avg Grade</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{quickStats.total_pending_assignments}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{quickStats.total_rewards_points}</p>
                  <p className="text-xs text-gray-600">Points</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{quickStats.average_character_score.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">Character</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students Overview - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Students Overview</h2>

            {studentsSummary.map((student) => (
              <Card
                key={student.student_id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                {/* Student Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {getInitials(student.full_name)}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-white flex items-center justify-center">
                        {getAttendanceIcon(student.attendance.status)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{student.full_name}</h3>
                      <p className="text-gray-600 text-sm">{student.grade_level} • {student.classes.total_classes} Classes</p>
                    </div>
                  </div>
                  <Badge className={`px-3 py-1 text-sm font-medium ${getAttendanceBadgeClass(student.attendance.status)}`}>
                    {student.attendance.status.charAt(0).toUpperCase() + student.attendance.status.slice(1)}
                  </Badge>
                </div>

                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-2xl font-bold text-blue-600">{student.academic_performance.grade_letter}</span>
                      {getTrendingIcon(student.academic_performance.trending)}
                    </div>
                    <div className="text-blue-600 text-xs font-medium">Grade</div>
                    <div className="text-gray-600 text-xs">{student.academic_performance.current_average.toFixed(1)}%</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">{student.attendance.attendance_rate.toFixed(0)}%</div>
                    <div className="text-green-600 text-xs font-medium">Attendance</div>
                    <div className="text-gray-600 text-xs">{student.attendance.present_days}d</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">{student.assignments.pending_count}</div>
                    <div className="text-orange-600 text-xs font-medium">Pending</div>
                    <div className="text-gray-600 text-xs">{student.assignments.completed_count}/{student.assignments.total_count}</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">{student.rewards.total_points}</div>
                    <div className="text-yellow-600 text-xs font-medium">Points</div>
                    <div className="text-gray-600 text-xs">{student.rewards.rank}</div>
                  </div>
                </div>

                {/* Top Subjects */}
                {student.subjects && student.subjects.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">Top Subjects</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {student.subjects.slice(0, 3).map((subject, index) => (
                        <div key={index} className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="font-bold text-gray-800 text-xs mb-1">{subject.name}</div>
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-bold text-blue-600 text-sm">{subject.grade}</span>
                            {getTrendingIcon(subject.trending)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Bars */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Assignments Progress</span>
                      <span className="text-xs text-gray-500">{student.assignments.completed_count}/{student.assignments.total_count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(student.assignments.completed_count / student.assignments.total_count) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Character Score</span>
                      <span className="text-xs text-gray-500">{student.character.character_score.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${student.character.character_score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <Link href={`/parent/gradebook`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      View Grades
                    </Button>
                  </Link>
                  <Link href={`/parent/assignments`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Assignments
                    </Button>
                  </Link>
                  <Link href={`/parent/attendance`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Attendance
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Activity Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <Card className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="space-y-4">
                {dashboardData?.recent_activity?.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        {activity.student_name}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {(!dashboardData?.recent_activity || dashboardData.recent_activity.length === 0) && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No recent activity</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl shadow-sm mt-4 text-white">
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/parent/classes">
                  <Button variant="secondary" className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View All Classes
                  </Button>
                </Link>
                <Link href="/parent/report-cards">
                  <Button variant="secondary" className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0">
                    <FileText className="h-4 w-4 mr-2" />
                    Report Cards
                  </Button>
                </Link>
                <Link href="/parent/rewards">
                  <Button variant="secondary" className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0">
                    <Award className="h-4 w-4 mr-2" />
                    View Rewards
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
