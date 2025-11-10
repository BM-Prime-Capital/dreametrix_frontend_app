import { getBackendUrl } from "@/app/utils/tenant"
import { MockParentDashboardService } from "./MockParentDashboardService"

/**
 * Types for Parent Dashboard data
 */

export interface ParentInfo {
  id: number
  full_name: string
  email: string
  linked_students_count: number
}

export interface AttendanceInfo {
  status: "present" | "absent" | "late"
  attendance_rate: number
  present_days: number
  absent_days: number
  late_days: number
}

export interface AcademicPerformance {
  current_average: number
  grade_letter: string
  trending: "up" | "down" | "stable"
}

export interface AssignmentsInfo {
  pending_count: number
  completed_count: number
  total_count: number
}

export interface SubjectGrade {
  name: string
  grade: string
  grade_percentage: number
  trending: "up" | "down" | "stable"
}

export interface RewardsInfo {
  total_points: number
  rank: string
  recent_achievements: string[]
}

export interface CharacterInfo {
  good_character_count: number
  bad_character_count: number
  character_score: number
  trending: "up" | "down" | "stable"
}

export interface ClassesInfo {
  total_classes: number
  active_classes: string[]
}

export interface StudentSummary {
  student_id: number
  student_user_id: number
  full_name: string
  grade_level: string
  attendance: AttendanceInfo
  academic_performance: AcademicPerformance
  assignments: AssignmentsInfo
  subjects?: SubjectGrade[]
  rewards: RewardsInfo
  character: CharacterInfo
  classes: ClassesInfo
}

export interface QuickStats {
  total_students: number
  all_present_today: boolean
  average_attendance_rate: number
  average_grade: number
  total_pending_assignments: number
  total_rewards_points: number
  average_character_score: number
}

export interface RecentActivity {
  type: "grade" | "assignment" | "reward" | "character" | "attendance"
  student_name: string
  description: string
  timestamp: string
  icon?: string
}

export interface ParentDashboardData {
  parent_info: ParentInfo
  students_summary: StudentSummary[]
  quick_stats: QuickStats
  recent_activity: RecentActivity[]
  _isMockData?: boolean
}

/**
 * Service for managing Parent Dashboard data
 */
class ParentDashboardServiceClass {
  /**
   * Get complete dashboard data for authenticated parent
   * @param accessToken - Parent's access token
   * @returns Promise with dashboard data
   */
  async getDashboardData(
    accessToken: string
  ): Promise<ParentDashboardData> {
    try {
      const response = await fetch(`${getBackendUrl()}/parents/dashboard/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        // If API not implemented yet (404), fallback to mock data
        if (response.status === 404) {
          console.warn("⚠️ Dashboard API not yet implemented, using mock data")
          const mockData = await MockParentDashboardService.getDashboardData()
          return { ...mockData, _isMockData: true }
        }
        throw new Error("Failed to load dashboard data")
      }

      return await response.json()
    } catch (error) {
      // If network error or API unreachable, try mock data as fallback
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.warn("⚠️ Dashboard API unreachable, using mock data")
        const mockData = await MockParentDashboardService.getDashboardData()
        return { ...mockData, _isMockData: true }
      }

      console.error("Error fetching dashboard data:", error)
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data"
      )
    }
  }

  /**
   * Get summary statistics for quick display
   * @param accessToken - Parent's access token
   * @returns Promise with quick stats
   */
  async getQuickStats(
    accessToken: string
  ): Promise<QuickStats> {
    try {
      const dashboardData = await this.getDashboardData(accessToken)
      return dashboardData.quick_stats
    } catch (error) {
      console.error("Error fetching quick stats:", error)
      throw error
    }
  }

  /**
   * Get student summaries only
   * @param accessToken - Parent's access token
   * @returns Promise with array of student summaries
   */
  async getStudentsSummary(
    accessToken: string
  ): Promise<StudentSummary[]> {
    try {
      const dashboardData = await this.getDashboardData(accessToken)
      return dashboardData.students_summary
    } catch (error) {
      console.error("Error fetching students summary:", error)
      throw error
    }
  }

  /**
   * Get data for a specific student
   * @param accessToken - Parent's access token
   * @param studentId - ID of the student
   * @returns Promise with student summary or null if not found
   */
  async getStudentSummary(
    accessToken: string,
    studentId: number
  ): Promise<StudentSummary | null> {
    try {
      const dashboardData = await this.getDashboardData(accessToken)
      const student = dashboardData.students_summary.find(
        s => s.student_id === studentId
      )
      return student || null
    } catch (error) {
      console.error(`Error fetching student ${studentId} summary:`, error)
      throw error
    }
  }

  /**
   * Check if all students are present today
   * @param accessToken - Parent's access token
   * @returns Promise<boolean>
   */
  async areAllStudentsPresent(accessToken: string): Promise<boolean> {
    try {
      const stats = await this.getQuickStats(accessToken)
      return stats.all_present_today
    } catch (error) {
      console.error("Error checking attendance status:", error)
      return false
    }
  }
}

// Export singleton instance
export const ParentDashboardService = new ParentDashboardServiceClass()
