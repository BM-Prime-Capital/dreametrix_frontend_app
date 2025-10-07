import type { ParentDashboardData } from "./ParentDashboardService"

/**
 * Mock data for Parent Dashboard
 * This data follows the exact structure defined in parent-dashboard-api-contract.json
 */
export const MOCK_PARENT_DASHBOARD_DATA: ParentDashboardData = {
  parent_info: {
    id: 1,
    full_name: "Abraham Nlandu",
    email: "abraham@example.com",
    linked_students_count: 2
  },
  students_summary: [
    {
      student_id: 8,
      student_user_id: 12,
      full_name: "Jordan Nguepi",
      grade_level: "Grade 5",
      attendance: {
        status: "present",
        attendance_rate: 95.5,
        present_days: 38,
        absent_days: 2,
        late_days: 1
      },
      academic_performance: {
        current_average: 87.5,
        grade_letter: "A-",
        trending: "up"
      },
      assignments: {
        pending_count: 3,
        completed_count: 12,
        total_count: 15
      },
      subjects: [
        {
          name: "Mathematics",
          grade: "A-",
          grade_percentage: 89.0,
          trending: "up"
        },
        {
          name: "Science",
          grade: "B+",
          grade_percentage: 87.5,
          trending: "up"
        },
        {
          name: "English",
          grade: "A",
          grade_percentage: 92.0,
          trending: "stable"
        },
        {
          name: "History",
          grade: "B+",
          grade_percentage: 85.0,
          trending: "up"
        },
        {
          name: "Physical Education",
          grade: "A",
          grade_percentage: 90.0,
          trending: "stable"
        }
      ],
      rewards: {
        total_points: 285,
        rank: "Gold",
        recent_achievements: ["Perfect Attendance Week", "Math Champion", "Top Reader"]
      },
      character: {
        good_character_count: 32,
        bad_character_count: 3,
        character_score: 91.4,
        trending: "up"
      },
      classes: {
        total_classes: 6,
        active_classes: ["Mathematics", "Science", "English", "History", "Art", "P.E."]
      }
    },
    {
      student_id: 9,
      student_user_id: 13,
      full_name: "Alice Smith",
      grade_level: "Grade 3",
      attendance: {
        status: "present",
        attendance_rate: 92.0,
        present_days: 36,
        absent_days: 3,
        late_days: 2
      },
      academic_performance: {
        current_average: 82.5,
        grade_letter: "B+",
        trending: "stable"
      },
      assignments: {
        pending_count: 2,
        completed_count: 10,
        total_count: 12
      },
      subjects: [
        {
          name: "Reading",
          grade: "A-",
          grade_percentage: 88.0,
          trending: "up"
        },
        {
          name: "Mathematics",
          grade: "B",
          grade_percentage: 80.0,
          trending: "down"
        },
        {
          name: "Science",
          grade: "B+",
          grade_percentage: 83.0,
          trending: "stable"
        },
        {
          name: "Art",
          grade: "A",
          grade_percentage: 90.0,
          trending: "up"
        }
      ],
      rewards: {
        total_points: 215,
        rank: "Silver",
        recent_achievements: ["Art Star", "Good Helper"]
      },
      character: {
        good_character_count: 28,
        bad_character_count: 4,
        character_score: 87.5,
        trending: "stable"
      },
      classes: {
        total_classes: 5,
        active_classes: ["Reading", "Mathematics", "Science", "Art", "Music"]
      }
    }
  ],
  quick_stats: {
    total_students: 2,
    all_present_today: true,
    average_attendance_rate: 93.75,
    average_grade: 85.0,
    total_pending_assignments: 5,
    total_rewards_points: 500,
    average_character_score: 89.45
  },
  recent_activity: [
    {
      type: "grade",
      student_name: "Jordan",
      description: "Received A- in Mathematics Quiz",
      timestamp: "2025-01-07T10:30:00Z"
    },
    {
      type: "reward",
      student_name: "Jordan",
      description: "Earned 'Math Champion' achievement",
      timestamp: "2025-01-07T09:15:00Z"
    },
    {
      type: "assignment",
      student_name: "Alice",
      description: "Submitted Art Project",
      timestamp: "2025-01-06T16:45:00Z"
    },
    {
      type: "character",
      student_name: "Jordan",
      description: "Received Good Character point for helping classmate",
      timestamp: "2025-01-06T14:20:00Z"
    },
    {
      type: "attendance",
      student_name: "Alice",
      description: "Perfect Attendance this week",
      timestamp: "2025-01-05T08:00:00Z"
    }
  ]
}

/**
 * Mock Parent Dashboard Service
 * Simulates backend API responses with realistic delay
 */
class MockParentDashboardServiceClass {
  /**
   * Simulate network delay
   */
  private async simulateNetworkDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  /**
   * Get complete dashboard data (mock)
   */
  async getDashboardData(): Promise<ParentDashboardData> {
    await this.simulateNetworkDelay()
    console.log("🎭 [MOCK MODE] Using mock parent dashboard data")
    return MOCK_PARENT_DASHBOARD_DATA
  }
}

export const MockParentDashboardService = new MockParentDashboardServiceClass()
