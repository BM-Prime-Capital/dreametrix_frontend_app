import { BACKEND_BASE_URL } from "@/app/utils/constants"

// Interfaces pour les données du gradebook basées sur la vraie API
export interface ParentChild {
  owner_id: number
  user_id: number
  full_name: string
  courses: {
    course_id: number
    course_name: string
    subject: string
  }[]
}

export interface Submission {
  id: number
  score: number
  max_score: number
  submission_date: string
  assessment_type: string
  title: string
}

export interface GradebookData {
  student_id: number
  class_id: number
  class_name: string
  student_name: string
  teacher_name: string
  average_grade: number
  total_submissions: number
  graded_submissions: number
  submissions: Submission[]
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

// Nouvelle interface pour les détails du gradebook
export interface GradebookDetails {
  student_name: string
  student_email: string
  student_average: number
  submissions: {
    assessment: number
    assessment_name: string
    assessment_type: string
    score: number
    voice_note: string | null
    marked: boolean
    submission_id?: number
  }[]
}

// Fonction pour récupérer les enfants du parent
export async function getParentChildren(accessToken: string): Promise<ParentChild[]> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/gradebooks/parent/children/`, {
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
    
    return data || []
  } catch (error) {
    console.error('Error fetching parent children:', error)
    throw new Error('Failed to fetch parent children')
  }
}

// Fonction pour récupérer les détails du gradebook
export async function getGradebookDetails(
  studentId: number, 
  classId: number, 
  accessToken: string
): Promise<GradebookDetails> {
  try {
    const url = `${BACKEND_BASE_URL}/gradebooks/parent/children/${studentId}/classes/${classId}/`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Response error text:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // L'API retourne un tableau, on prend le premier élément
    if (Array.isArray(data) && data.length > 0) {
      return data[0]
    } else if (Array.isArray(data) && data.length === 0) {
      throw new Error('No gradebook details found')
    } else {
      // Si ce n'est pas un tableau, on retourne directement
      return data
    }
  } catch (error) {
    console.error('Error fetching gradebook details:', error)
    throw new Error('Failed to fetch gradebook details')
  }
} 