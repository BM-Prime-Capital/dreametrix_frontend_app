"use client"

import { useState, useCallback, useEffect } from "react"

interface SchoolRequest {
  id: number
  name: string
  school_email: string
  administrator_email: string
  phone: string
  country: string
  city: string
  address: string
  region: string
  is_reviewed: boolean
  is_approved: boolean | null
  is_denied: boolean | null
  created_at: string
}

interface UpdateStatusPayload extends Omit<SchoolRequest, "id" | "created_at"> {
  is_approved: boolean
  is_denied: boolean
}

export function useSchoolRequests() {
  const [schoolRequests, setSchoolRequests] = useState<SchoolRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSchoolRequests = useCallback(async () => {
    try {
      setLoading(true)

      // Basic auth credentials
      const username = "development@bmprimecapital.com"
      const password = "#thi$th3Dr3amT3@M!"

      // Create the Authorization header with Basic auth
      const credentials = btoa(`${username}:${password}`)
      const authHeader = `Basic ${credentials}`

      console.log("Fetch Request Details:", {
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/school-requests/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        credentials: {
          username,
          password: password.substring(0, 3) + "...",
        },
      })
      console.log(credentials)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/school-requests/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        })
        throw new Error(`Failed to fetch school requests: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Fetch Response Data:", data)
      setSchoolRequests(data.results)
      setError(null)
    } catch (error) {
      console.error("Error fetching school requests:", error)
      setError(error instanceof Error ? error : new Error("Unknown error occurred"))
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSchoolStatus = useCallback(async (id: number, payload: UpdateStatusPayload) => {
    try {
      const username = "development@bmprimecapital.com"
      const password = "#thi$th3Dr3amT3@M!"

      const credentials = btoa(`${username}:${password}`)
      const authHeader = `Basic ${credentials}`

      console.log("Update Request Details:", {
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/school-requests/${id}/`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        credentials: {
          username,
          password: password.substring(0, 3) + "...",
        },
        payload,
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/school-requests/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        })
        throw new Error(`Failed to update school status: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Update Response Data:", data)
      return data
    } catch (error) {
      console.error("Error updating school status:", error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchSchoolRequests()
  }, [fetchSchoolRequests])

  return {
    schoolRequests,
    loading,
    error,
    updateSchoolStatus,
    refreshSchoolRequests: fetchSchoolRequests,
  }
}

