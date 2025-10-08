import { BACKEND_BASE_URL } from "@/app/utils/constants"

/**
 * Types for Parent-Student relationship management
 */

export interface LinkRequest {
  relation_id: number
  student_id: number
  student_user_id: number
  student_full_name: string
  requested_at: string | null
}

export interface LinkedStudent {
  relation_id: number
  student_id: number
  student_user_id: number
  student_full_name: string
  student_email?: string
  relationship_since?: string
}

export interface RequestLinkPayload {
  student_code: string
}

export interface RequestLinkResponse {
  message: string
  request_id: number
  status: "pending"
}

export interface ListRequestLinksResponse {
  pending_links: LinkRequest[]
}

export interface LinkedStudentsResponse {
  linked_students: LinkedStudent[]
}

export interface CancelRequestResponse {
  message: string
  request_id: number
}

/**
 * Service for managing Parent-Student relationships
 */
class ParentRelationshipServiceClass {
  /**
   * Request to link a student account with parent account
   * @param studentCode - The student's unique code
   * @param accessToken - Parent's access token
   * @returns Promise with request information
   */
  async requestLink(
    studentCode: string,
    accessToken: string
  ): Promise<RequestLinkResponse> {
    try {
      const payload: RequestLinkPayload = {
        student_code: studentCode.trim().toUpperCase()
      }

      const response = await fetch(`${BACKEND_BASE_URL}/parent/relationship/request-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error("Failed to submit link request")
      }

      return await response.json()
    } catch (error) {

      console.error("Error requesting student link:", error)
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to submit link request. Please verify the student code and try again."
      )
    }
  }

  /**
   * Get all pending link requests for the current parent
   * @param accessToken - Parent's access token
   * @returns Promise with list of pending link requests
   */
  async listRequestLinks(
    accessToken: string
  ): Promise<ListRequestLinksResponse> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/parents/parent/pending-student-links/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to load pending link requests")
      }

      const data = await response.json()
      return {
        pending_links: Array.isArray(data) ? data : []
      }
    } catch (error) {

      console.error("Error fetching pending link requests:", error)
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to load pending link requests"
      )
    }
  }

  /**
   * Get all linked students for the current parent
   * @param accessToken - Parent's access token
   * @returns Promise with list of linked students
   */
  async getLinkedStudents(
    accessToken: string
  ): Promise<LinkedStudentsResponse> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/parents/parent/linked-students/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to load linked students")
      }

      const data = await response.json()
      return {
        linked_students: Array.isArray(data) ? data : []
      }
    } catch (error) {
      console.error("Error fetching linked students:", error)
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to load linked students"
      )
    }
  }

  /**
   * Cancel a pending link request
   * @param requestId - The ID of the request to cancel
   * @param accessToken - Parent's access token
   * @returns Promise with cancellation confirmation
   */
  async cancelRequestLink(
    requestId: number,
    accessToken: string
  ): Promise<CancelRequestResponse> {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/parent/relationship/cancel-request/${requestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to cancel link request")
      }

      return await response.json()
    } catch (error) {
      console.error("Error canceling link request:", error)
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to cancel link request"
      )
    }
  }

  /**
   * Check if parent has any linked students
   * @param accessToken - Parent's access token
   * @returns Promise<boolean> - true if parent has linked students
   */
  async hasLinkedStudents(accessToken: string): Promise<boolean> {
    try {
      const response = await this.getLinkedStudents(accessToken)
      return response.linked_students.length > 0
    } catch (error) {
      console.error("Error checking linked students:", error)
      return false
    }
  }

  /**
   * Check if parent has any pending link requests
   * @param accessToken - Parent's access token
   * @returns Promise<boolean> - true if parent has pending requests
   */
  async hasPendingRequests(accessToken: string): Promise<boolean> {
    try {
      const response = await this.listRequestLinks(accessToken)
      return response.pending_links.length > 0
    } catch (error) {
      console.error("Error checking pending requests:", error)
      return false
    }
  }

  /**
   * Get parent relationship status (for determining what UI to show)
   * @param accessToken - Parent's access token
   * @returns Promise with relationship status
   */
  async getRelationshipStatus(
    accessToken: string
  ): Promise<{
    hasLinkedStudents: boolean
    hasPendingRequests: boolean
    linkedStudentsCount: number
    pendingRequestsCount: number
  }> {
    try {
      const [linkedStudents, linkRequests] = await Promise.all([
        this.getLinkedStudents(accessToken),
        this.listRequestLinks(accessToken)
      ])

      return {
        hasLinkedStudents: linkedStudents.linked_students.length > 0,
        hasPendingRequests: linkRequests.pending_links.length > 0,
        linkedStudentsCount: linkedStudents.linked_students.length,
        pendingRequestsCount: linkRequests.pending_links.length
      }
    } catch (error) {
      console.error("Error getting relationship status:", error)
      return {
        hasLinkedStudents: false,
        hasPendingRequests: false,
        linkedStudentsCount: 0,
        pendingRequestsCount: 0
      }
    }
  }
}

// Export singleton instance
export const ParentRelationshipService = new ParentRelationshipServiceClass()

/**
 * Helper functions for direct use in components
 */

/**
 * Send a link request to a student by email
 * @param accessToken - Parent's access token
 * @param studentEmail - Student's email address
 * @param message - Optional message to the student
 */
export async function sendLinkRequest(
  accessToken: string,
  studentEmail: string,
  message?: string
): Promise<RequestLinkResponse> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/parents/request-link/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        student_email: studentEmail,
        message: message || ""
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to send link request")
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending link request:", error)
    throw error
  }
}

/**
 * Get list of pending link requests (returns array format for components)
 */
export async function getListRequestLink(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/parents/parent/pending-student-links/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error("Failed to load pending requests")
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching pending requests:", error)
    throw error
  }
}

/**
 * Cancel a pending link request
 */
export async function cancelLinkRequest(
  accessToken: string,
  requestId: number
): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/parents/parent/pending-student-links/${requestId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error("Failed to cancel request")
    }
  } catch (error) {
    console.error("Error canceling request:", error)
    throw error
  }
}

/**
 * Unlink a student from parent account
 */
export async function unlinkStudent(
  accessToken: string,
  studentId: number
): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/parents/unlink-requests/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        student_id: studentId
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to unlink student")
    }
  } catch (error) {
    console.error("Error unlinking student:", error)
    throw error
  }
}
