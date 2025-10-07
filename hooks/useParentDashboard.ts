import { useState, useEffect, useCallback } from "react"
import {
  ParentDashboardService,
  ParentDashboardData,
  StudentSummary,
  QuickStats
} from "@/services/ParentDashboardService"

interface UseParentDashboardReturn {
  // State
  dashboardData: ParentDashboardData | null
  loading: boolean
  error: string | null
  isMockMode: boolean

  // Computed values
  hasStudents: boolean
  studentsCount: number
  allPresentToday: boolean
  averageAttendanceRate: number
  averageGrade: number
  totalPendingAssignments: number

  // Data accessors
  parentInfo: ParentDashboardData["parent_info"] | null
  studentsSummary: StudentSummary[]
  quickStats: QuickStats | null

  // Actions
  refreshData: () => Promise<void>
  getStudentById: (studentId: number) => StudentSummary | null
}

/**
 * Custom hook for managing parent dashboard data
 * @param accessToken - Parent's access token
 * @returns Object with dashboard data and actions
 */
export function useParentDashboard(
  accessToken: string | null
): UseParentDashboardReturn {
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await ParentDashboardService.getDashboardData(accessToken)
      setDashboardData(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data"
      setError(errorMessage)
      console.error("Error fetching parent dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  // Get student by ID
  const getStudentById = useCallback(
    (studentId: number): StudentSummary | null => {
      if (!dashboardData) return null
      return (
        dashboardData.students_summary.find(
          (s) => s.student_id === studentId
        ) || null
      )
    },
    [dashboardData]
  )

  // Computed values
  const hasStudents = (dashboardData?.students_summary.length ?? 0) > 0
  const studentsCount = dashboardData?.students_summary.length ?? 0
  const allPresentToday = dashboardData?.quick_stats.all_present_today ?? false
  const averageAttendanceRate = dashboardData?.quick_stats.average_attendance_rate ?? 0
  const averageGrade = dashboardData?.quick_stats.average_grade ?? 0
  const totalPendingAssignments = dashboardData?.quick_stats.total_pending_assignments ?? 0
  const isMockMode = dashboardData?._isMockData ?? false

  return {
    // State
    dashboardData,
    loading,
    error,
    isMockMode,

    // Computed values
    hasStudents,
    studentsCount,
    allPresentToday,
    averageAttendanceRate,
    averageGrade,
    totalPendingAssignments,

    // Data accessors
    parentInfo: dashboardData?.parent_info ?? null,
    studentsSummary: dashboardData?.students_summary ?? [],
    quickStats: dashboardData?.quick_stats ?? null,

    // Actions
    refreshData,
    getStudentById
  }
}
