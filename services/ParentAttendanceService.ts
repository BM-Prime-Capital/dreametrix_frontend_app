import { BACKEND_BASE_URL } from "@/app/utils/constants"

// Interfaces pour les données de l'attendance basées sur la vraie API
export interface ParentChild {
  student_id: number
  full_name: string
  statistics: {
    total_days: number
    present_days: number
    absent_days: number
    late_days: number
  }
}

export interface AttendanceData {
  student_id: number
  full_name: string
  class_name: string
  date: string
  status: "present" | "absent" | "late"
  statistics: {
    total_days: number
    present_days: number
    absent_days: number
    late_days: number
  }
}

export interface ClassData {
  id: number
  name: string
  subject: string
  level: number
  teacher: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  description?: string
}

// Fonction pour récupérer les données d'attendance des enfants du parent
export async function getParentAttendanceView(
  accessToken: string, 
  limit: number = 20, 
  offset: number = 0
): Promise<ParentChild[]> {
  try {
    console.log('Fetching parent attendance from:', `${BACKEND_BASE_URL}/attendances/parent_view/?limit=${limit}&offset=${offset}`)
    
    const response = await fetch(`${BACKEND_BASE_URL}/attendances/parent_view/?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Parent attendance data:', data)
    
    return data || []
  } catch (error) {
    console.error('Error fetching parent attendance:', error)
    throw new Error('Failed to fetch parent attendance')
  }
} 