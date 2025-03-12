"use client"

import { useState, useEffect } from "react"
import { useBaseUrl } from "./use-base-url"
import { toast } from "react-toastify"
import type { User, School } from "./use-teachers"

export interface Student {
  id: number
  user: User
  school: School
  uuid: string
  created_at: string
  last_update: string
  grade: number
  extra_data: null
  enrolled_courses: null[]
}

export interface StudentsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Student[]
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { baseUrl, error: baseUrlError } = useBaseUrl()

  useEffect(() => {
    if (baseUrlError) {
      setError(baseUrlError)
      setIsLoading(false)
      return
    }

    if (!baseUrl) {
      return // Wait for baseUrl to be available
    }

    const fetchStudents = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")

        if (!accessToken) {
          throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.")
        }

        const response = await fetch(`${baseUrl}/students/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Votre session a expiré. Veuillez vous reconnecter.")
          } else if (response.status === 403) {
            throw new Error("Vous n'avez pas la permission d'accéder aux étudiants.")
          } else {
            throw new Error("Erreur lors de la récupération des étudiants.")
          }
        }

        const data: StudentsResponse = await response.json()
        setStudents(data.results)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des étudiants."
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [baseUrl, baseUrlError])

  return { students, isLoading, error }
}

