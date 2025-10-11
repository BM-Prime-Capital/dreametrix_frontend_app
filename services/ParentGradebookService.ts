import { BACKEND_BASE_URL } from "@/app/utils/constants"

// Interfaces réutilisées du StudentGradebookService
export interface StudentClass {
  course: string
  course_id: number
  class_average: number
  student_average: number
  assessments: Assessment[]
}

export interface Assessment {
  assessment_type: string
  name: string
  weight: number
}

export interface Submission {
  assessment: number
  assessment_name: string
  assessment_type: string
  score: number
  voice_note: string | null
  marked: boolean
  submission_id: number
}

export interface StudentGradebookDetail {
  student: number
  student_name: string
  student_email: string
  student_average: number
  submissions: Submission[]
}

// Interface pour les enfants liés du parent
export interface LinkedStudent {
  id: number
  full_name: string
  email: string
  grade_level?: number
}

// Interface pour la réponse de l'API /gradebooks/parent/children/
interface ParentChildrenResponse {
  owner_id: number
  user_id: number
  full_name: string
  courses: {
    course_id: number
    course_name: string
    subject: string
    class_average: number
    student_average: number
    assessments: Assessment[]
  }[]
}

// Exported types for UI components
export type ParentChild = ParentChildrenResponse

// Shape expected by UI hook/components
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
}

// Minimal gradebook aggregate for table usage
export interface GradebookData {
  student_id: number
  class_id: number
  average_score: number
}

// Fetch full parent children structure including courses
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

    const data: ParentChildrenResponse[] = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching parent children:', error)
    throw new Error('Failed to fetch parent children')
  }
}

/**
 * Récupère la liste des enfants liés au parent
 */
export async function getLinkedStudents(accessToken: string): Promise<LinkedStudent[]> {
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

    const data: ParentChildrenResponse[] = await response.json()

    // Transformer les données pour obtenir une liste simple d'étudiants
    if (Array.isArray(data)) {
      return data.map((item) => ({
        id: item.owner_id,
        full_name: item.full_name,
        email: '',
        grade_level: undefined
      }))
    }

    return []
  } catch (error) {
    console.error('Error fetching linked students:', error)
    throw new Error('Failed to fetch linked students')
  }
}

/**
 * Récupère toutes les classes d'un étudiant spécifique (pour le parent)
 */
export async function getStudentClassesForParent(
  studentId: number,
  accessToken: string
): Promise<StudentClass[]> {
  try {
    // Fetch all children data
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

    const data: ParentChildrenResponse[] = await response.json()

    // Trouver l'étudiant par owner_id
    const student = data.find(child => child.owner_id === studentId)

    if (!student) {
      console.log('Student not found with id:', studentId)
      return []
    }

    // Transformer les courses en StudentClass[]
    const classes: StudentClass[] = student.courses.map(course => ({
      course: course.course_name,
      course_id: course.course_id,
      class_average: course.class_average,
      student_average: course.student_average,
      assessments: course.assessments
    }))

    console.log('Student classes data for parent:', classes)
    return classes
  } catch (error) {
    console.error('Error fetching student classes for parent:', error)
    throw new Error('Failed to fetch student classes')
  }
}

/**
 * Récupère les détails du gradebook pour une classe spécifique d'un étudiant (pour le parent)
 */
export async function getStudentClassGradebookForParent(
  studentId: number,
  classId: number,
  accessToken: string
): Promise<StudentGradebookDetail[]> {
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
    console.log('Class gradebook data for parent:', data)

    // L'API retourne un tableau
    return Array.isArray(data) ? data : [data]
  } catch (error) {
    console.error('Error fetching class gradebook for parent:', error)
    throw new Error('Failed to fetch class gradebook details')
  }
}

/**
 * Calcule les statistiques globales à partir des classes d'un étudiant
 */
export function calculateStudentStats(classes: StudentClass[]) {
  if (!classes || classes.length === 0) {
    return {
      overallAverage: 0,
      totalClasses: 0,
      bestSubject: { name: "", average: 0 },
      totalAssessments: 0
    }
  }

  // Calculer la moyenne globale
  const totalAverage = classes.reduce((sum, cls) => sum + cls.student_average, 0)
  const overallAverage = totalAverage / classes.length

  // Trouver la meilleure matière
  const bestSubject = classes.reduce((best, current) =>
    current.student_average > best.student_average ? current : best
  )

  // Compter le total d'assessments
  const totalAssessments = classes.reduce((sum, cls) => sum + cls.assessments.length, 0)

  return {
    overallAverage: Math.round(overallAverage * 10) / 10,
    totalClasses: classes.length,
    bestSubject: {
      name: bestSubject.course,
      average: bestSubject.student_average
    },
    totalAssessments
  }
}

/**
 * Formate les données de classe pour l'affichage
 */
export function formatClassData(classData: StudentClass) {
  const assessmentCounts = {
    test: 0,
    quiz: 0,
    homework: 0,
    participation: 0,
    other: 0,
  }

  classData.assessments.forEach((assessment) => {
    const type = assessment.assessment_type.toLowerCase()
    if (assessmentCounts.hasOwnProperty(type)) {
      assessmentCounts[type as keyof typeof assessmentCounts]++
    } else {
      assessmentCounts.other++
    }
  })

  return {
    id: classData.course_id,
    name: classData.course,
    average: `${classData.student_average.toFixed(1)}%`,
    classAverage: `${classData.class_average.toFixed(1)}%`,
    noOfExams: assessmentCounts.test,
    noOfTests: assessmentCounts.quiz,
    noOfHomeworks: assessmentCounts.homework,
    noOfParticipation: assessmentCounts.participation,
    noOfOther: assessmentCounts.other,
    totalWork: Object.values(assessmentCounts).reduce((a, b) => a + b, 0),
    assessments: classData.assessments,
    rawAverage: classData.student_average,
    rawClassAverage: classData.class_average,
  }
}

/**
 * Calcule les statistiques détaillées pour une classe
 */
export function calculateClassStats(details: StudentGradebookDetail[]) {
  if (!details || details.length === 0) {
    return {
      studentAverage: 0,
      totalSubmissions: 0,
      markedSubmissions: 0,
      averageScore: 0
    }
  }

  const detail = details[0]
  const submissions = detail.submissions

  // Calculer la moyenne des scores
  const validScores = submissions.filter(sub => sub.score > 0)
  const averageScore = validScores.length > 0
    ? validScores.reduce((sum, sub) => sum + sub.score, 0) / validScores.length
    : 0

  // Compter les soumissions marquées
  const markedSubmissions = submissions.filter(sub => sub.marked).length

  return {
    studentAverage: detail.student_average,
    totalSubmissions: submissions.length,
    markedSubmissions,
    averageScore: Math.round(averageScore * 10) / 10
  }
} 

// Convenience type and fetcher for dialog usage
export type GradebookDetails = StudentGradebookDetail

export async function getGradebookDetails(
  studentId: number,
  classId: number,
  accessToken: string
): Promise<GradebookDetails> {
  const details = await getStudentClassGradebookForParent(studentId, classId, accessToken)
  return details[0]
}