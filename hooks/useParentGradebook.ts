import { useState, useEffect, useCallback } from 'react'
import { 
  getParentChildren, 
  getGradebookDetails,
  ParentChild, 
  GradebookData, 
  ClassData 
} from '@/services/ParentGradebookService'

interface UseParentGradebookProps {
  accessToken: string
}

interface UseParentGradebookReturn {
  children: ParentChild[]
  gradebookData: GradebookData[]
  classData: ClassData[]
  loading: boolean
  error: string | null
  refreshData: () => void
  currentPage: number
  totalPages: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
}

export function useParentGradebook({ accessToken }: UseParentGradebookProps): UseParentGradebookReturn {
  const [children, setChildren] = useState<ParentChild[]>([])
  const [gradebookData, setGradebookData] = useState<GradebookData[]>([])
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
      console.log('Starting to fetch all gradebook data...')

      // 1. Récupérer tous les enfants
      const childrenData = await getParentChildren(accessToken)
      setChildren(childrenData)
      console.log('Children fetched:', childrenData)

      // 2. Créer les données de classe directement depuis les courses
      const allClassData: ClassData[] = []
      const processedClassIds = new Set<number>()

      for (const child of childrenData) {
        for (const course of child.courses) {
          if (!processedClassIds.has(course.course_id)) {
            const classDetails: ClassData = {
              id: course.course_id,
              name: course.course_name,
              subject: course.subject,
              level: 0, // On n'a pas cette info dans l'API
              teacher: {
                id: 0,
                first_name: "N/A",
                last_name: "N/A",
                email: "N/A"
              }
            }
            allClassData.push(classDetails)
            processedClassIds.add(course.course_id)
          }
        }
      }

      setClassData(allClassData)
      console.log('All class data fetched:', allClassData)

      // 3. Pour l'instant, on utilise un tableau vide car nous utilisons directement les données des filtres
      setGradebookData([])
      console.log('Using filter data directly for table')

      // Calculer le nombre total de pages basé sur les données des enfants
      const totalItems = childrenData.reduce((sum, child) => sum + child.courses.length, 0)
      setTotalPages(Math.ceil(totalItems / itemsPerPage))

    } catch (err: any) {
      console.error('Error fetching gradebook data:', err)
      setError(err.message || 'Failed to fetch gradebook data')
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
    gradebookData,
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