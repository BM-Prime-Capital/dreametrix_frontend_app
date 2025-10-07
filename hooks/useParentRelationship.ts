import { useState, useEffect, useCallback } from "react"
import {
  ParentRelationshipService,
  LinkedStudent,
  LinkRequest
} from "@/services/ParentRelationshipService"

interface UseParentRelationshipReturn {
  // State
  linkedStudents: LinkedStudent[]
  linkRequests: LinkRequest[]
  loading: boolean
  error: string | null

  // Computed values
  hasLinkedStudents: boolean
  hasPendingRequests: boolean
  linkedStudentsCount: number
  pendingRequestsCount: number

  // Actions
  requestLink: (studentCode: string) => Promise<void>
  cancelRequest: (requestId: number) => Promise<void>
  refreshData: () => Promise<void>
}

/**
 * Custom hook for managing parent-student relationships
 * @param accessToken - Parent's access token
 * @returns Object with relationship data and actions
 */
export function useParentRelationship(
  accessToken: string | null
): UseParentRelationshipReturn {
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([])
  const [linkRequests, setLinkRequests] = useState<LinkRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all relationship data
  const fetchData = useCallback(async () => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [linkedStudentsData, linkRequestsData] = await Promise.all([
        ParentRelationshipService.getLinkedStudents(accessToken),
        ParentRelationshipService.listRequestLinks(accessToken)
      ])

      setLinkedStudents(linkedStudentsData.linked_students)
      setLinkRequests(linkRequestsData.pending_links)
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load relationship data"
      setError(errorMessage)
      console.error("Error fetching parent relationship data:", err)
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Request to link a new student
  const requestLink = useCallback(
    async (studentCode: string) => {
      if (!accessToken) {
        throw new Error("No access token available")
      }

      setError(null)

      try {
        await ParentRelationshipService.requestLink(studentCode, accessToken)

        // Refresh data to get the new request
        await fetchData()
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to submit link request"
        setError(errorMessage)
        throw err
      }
    },
    [accessToken, fetchData]
  )

  // Cancel a pending link request
  const cancelRequest = useCallback(
    async (requestId: number) => {
      if (!accessToken) {
        throw new Error("No access token available")
      }

      setError(null)

      try {
        await ParentRelationshipService.cancelRequestLink(requestId, accessToken)

        // Refresh data to remove the canceled request
        await fetchData()
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to cancel link request"
        setError(errorMessage)
        throw err
      }
    },
    [accessToken, fetchData]
  )

  // Refresh all data
  const refreshData = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  // Computed values
  const hasLinkedStudents = linkedStudents.length > 0
  const hasPendingRequests = linkRequests.length > 0
  const linkedStudentsCount = linkedStudents.length
  const pendingRequestsCount = linkRequests.length

  return {
    // State
    linkedStudents,
    linkRequests,
    loading,
    error,

    // Computed values
    hasLinkedStudents,
    hasPendingRequests,
    linkedStudentsCount,
    pendingRequestsCount,

    // Actions
    requestLink,
    cancelRequest,
    refreshData
  }
}
