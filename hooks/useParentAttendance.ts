import { useState, useEffect, useCallback } from 'react'
import { 
  getParentAttendanceView,
  ParentChild, 
  AttendanceData, 
  ClassData 
} from '@/services/ParentAttendanceService'

interface UseParentAttendanceProps {
  accessToken: string
}

interface UseParentAttendanceReturn {
  children: ParentChild[]
  attendanceData: AttendanceData[]
  classData: ClassData[]
  loading: boolean
  error: string | null
  refreshData: () => void
  currentPage: number
  totalPages: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
}

export function useParentAttendance({ accessToken }: UseParentAttendanceProps): UseParentAttendanceReturn {
  const [children, setChildren] = useState<ParentChild[]>([])
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [classData, setClassData] = useState<ClassData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)

  const fetchAllData = useCallback(async () => {
    if (!accessToken) return

    setLoading(true)
    setError(null)

    try {
      console.log('Starting to fetch all attendance data...')

      // 1. Récupérer les données d'attendance des enfants
      const childrenData = await getParentAttendanceView(accessToken, 50, 0)
      setChildren(childrenData)
      console.log('Children attendance data fetched:', childrenData)

      // 2. Créer des données simulées pour les classes (en attendant l'API)
      const mockClassData: ClassData[] = [
        {
          id: 1,
          name: "Class 5 - Sci",
          subject: "Science",
          level: 5,
          teacher: {
            id: 1,
            first_name: "Eva",
            last_name: "Parker",
            email: "eva.parker@school.com"
          }
        },
        {
          id: 2,
          name: "Class 5 - Math",
          subject: "Mathematics",
          level: 5,
          teacher: {
            id: 2,
            first_name: "Sam",
            last_name: "Burke",
            email: "sam.burke@school.com"
          }
        },
        {
          id: 3,
          name: "Class 5 - Bio",
          subject: "Biology",
          level: 5,
          teacher: {
            id: 3,
            first_name: "Anna",
            last_name: "Blake",
            email: "anna.blake@school.com"
          }
        }
      ]
      setClassData(mockClassData)
      console.log('Mock class data created:', mockClassData)

      // 3. Créer des données simulées pour l'attendance (en attendant l'API complète)
      const mockAttendanceData: AttendanceData[] = []
      
      for (const child of childrenData) {
        // Créer des données pour chaque classe
        for (const classItem of mockClassData) {
          const mockData: AttendanceData = {
            student_id: child.student_id,
            full_name: child.full_name,
            class_name: classItem.name,
            date: new Date().toISOString().split('T')[0], // Aujourd'hui
            status: "present", // Simulé
            statistics: child.statistics
          }
          mockAttendanceData.push(mockData)
        }
      }

      setAttendanceData(mockAttendanceData)
      console.log('Mock attendance data created:', mockAttendanceData)

      // Calculer le nombre total de pages
      const total = mockAttendanceData.length
      setTotalPages(Math.ceil(total / itemsPerPage))

    } catch (err: any) {
      console.error('Error fetching attendance data:', err)
      setError(err.message || 'Failed to fetch attendance data')
    } finally {
      setLoading(false)
    }
  }, [accessToken, itemsPerPage])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const refreshData = useCallback(() => {
    fetchAllData()
  }, [fetchAllData])

  return {
    children,
    attendanceData,
    classData,
    loading,
    error,
    refreshData,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage
  }
} 