import { Assignment, Submission } from "@/app/api/student/assignment/assignment.model";

// Extended interface for parent assignments with additional properties
export interface ParentAssignment extends Omit<Assignment, "course"> {
  teacher: string;
  class: string;
  day?: string;
  course: {
    id: number;
    name: string;
  };
  student_name?: string;
  student_id?: number;
}

export interface ParentAssignmentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ParentAssignment[];
}

/**
 * Fetches all assignments for a parent's children
 * @param accessToken - The parent's access token
 * @param refreshToken - The parent's refresh token
 * @param filters - Optional filters for assignments
 * @returns Promise<ParentAssignment[]> - Array of assignments for all children
 */
export async function getParentAssignments(
  accessToken: string,
  refreshToken: string,
  filters?: {
    student_id?: number;
    class_id?: number;
    course_id?: number;
    date_from?: string;
    date_to?: string;
    published?: boolean;
  }
): Promise<ParentAssignment[]> {
  const url = new URL('/api/parent/assignments', window.location.origin);
  
  // Add query parameters if filters are provided
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(errorData.error || "Error fetching parent assignments");
    }

    const data: ParentAssignmentsResponse = await response.json();
    console.log("Parent assignments data:", data);
    
    return data.results || [];
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

/**
 * Fetches assignments for a specific child of a parent
 * @param childId - The ID of the specific child
 * @param accessToken - The parent's access token
 * @param refreshToken - The parent's refresh token
 * @param filters - Optional filters for assignments
 * @returns Promise<ParentAssignment[]> - Array of assignments for the specific child
 */
export async function getChildAssignments(
  childId: number,
  accessToken: string,
  refreshToken: string,
  filters?: {
    class_id?: number;
    course_id?: number;
    date_from?: string;
    date_to?: string;
    published?: boolean;
  }
): Promise<ParentAssignment[]> {
  const url = new URL('/api/parent/assignments', window.location.origin);
  
  // Add child_id filter
  url.searchParams.append("student_id", childId.toString());
  
  // Add additional query parameters if filters are provided
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(errorData.error || "Error fetching child assignments");
    }

    const data: ParentAssignmentsResponse = await response.json();
    console.log("Child assignments data:", data);
    
    return data.results || [];
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

/**
 * Fetches assignment details for a specific assignment
 * @param assignmentId - The ID of the assignment
 * @param accessToken - The parent's access token
 * @returns Promise<ParentAssignment> - Assignment details
 */
export async function getAssignmentDetails(
  assignmentId: number,
  accessToken: string
): Promise<ParentAssignment> {
  const url = `/api/parent/assignments/${assignmentId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(errorData.error || "Error fetching assignment details");
    }

    const data: ParentAssignment = await response.json();
    console.log("Assignment details:", data);
    
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

/**
 * Fetches submission details for a specific assignment
 * @param assignmentId - The ID of the assignment
 * @param accessToken - The parent's access token
 * @returns Promise<Submission[]> - Submission details
 */
export async function getAssignmentSubmission(
  assignmentId: number,
  accessToken: string
): Promise<Submission[]> {
  const url = `/api/parent/assignments/${assignmentId}/submissions`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(errorData.error || "Error fetching assignment submission");
    }

    const data = await response.json();
    console.log("Assignment submission:", data);
    
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
} 