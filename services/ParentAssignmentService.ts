/* eslint-disable @typescript-eslint/no-explicit-any */
import { BACKEND_BASE_URL } from '@/app/utils/constants';

// Interface for the API response structure
interface ApiAssessment {
  id: number;
  name: string;
  file: string;
  due_date: string;
  weight: string;
  kind: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  course: {
    id: number;
    name: string;
  };
}

interface ApiAssessmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiAssessment[];
}

// Interface for parent assignments
export interface ParentAssignment {
  description: string;
  title: string;
  id: number;
  name: string;
  file: string;
  due_date: string;
  weight: string;
  kind: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  course: {
    id: number;
    name: string;
  };
  teacher?: string;
  class?: string;
  day?: string;
  student_name?: string;
  student_id?: number;
  students?: {
    id: number;
    name: string;
  }[];
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
  // refreshToken: string,
  // filters?: {
  //   student_id?: number;
  //   class_id?: number;
  //   course_id?: number;
  //   date_from?: string;
  //   date_to?: string;
  //   published?: boolean;
  // }
): Promise<any> {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${BACKEND_BASE_URL}/parents/children/assessments/`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access assignments.");
      } else {
        throw new Error("Error retrieving assignments.");
      }
    }

    const data: ApiAssessmentResponse = await response.json();
    console.log("Parent assignments data:", data);
    
    // Transform API data to ParentAssignment format
  //   const assignments: ParentAssignment[] = (
  //     data.results || []).map((assessment: ApiAssessment): ParentAssignment => (
  //   //   {
  //   //   id: assessment.id,
  //   //   name: assessment.name,
  //   //   file: assessment.file,
  //   //   due_date: assessment.due_date,
  //   //   weight: assessment.weight,
  //   //   kind: assessment.kind,
  //   //   published: assessment.published,
  //   //   created_at: assessment.created_at,
  //   //   updated_at: assessment.updated_at,
  //   //   course: assessment.course,
  //   //   published_at: assessment.published_at,
  //   //   teacher: "Teacher", // Not provided by API
  //   //   class: assessment.course.name,
  //   //   day: assessment.due_date
  //   // }
  // ));
    
   // return assignments;
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
  // refreshToken: string,
  // filters?: {
  //   class_id?: number;
  //   course_id?: number;
  //   date_from?: string;
  //   date_to?: string;
  //   published?: boolean;
  // }
): Promise<ParentAssignment[]> {
  // For now, we'll use the same endpoint as all assignments
  // In the future, this could be filtered by child_id if the API supports it
  return getParentAssignments(accessToken);
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
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${BACKEND_BASE_URL}/assessments/${assignmentId}/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access this assignment.");
      } else if (response.status === 404) {
        throw new Error("Assignment not found.");
      } else {
        throw new Error("Error retrieving assignment details.");
      }
    }

    const data: ApiAssessment = await response.json();
    console.log("Assignment details:", data);
    
    // Transform API data to ParentAssignment format
    const assignment: any = {
      id: data.id,
      name: data.name,
      file: data.file,
      due_date: data.due_date,
      weight: data.weight,
      kind: data.kind,
      published: data.published,
      created_at: data.created_at,
      updated_at: data.updated_at,
      course: data.course,
      published_at: data.published_at,
      teacher: "Teacher", // Not provided by API
      class: data.course.name,
      day: data.due_date
    };
    
    return assignment;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

// Interface for submission data
export interface Submission {
  id: number;
  student: number;
  course: number;
  assessment: number;
  file: string | null;
  grade: number | null;
  submitted_at: string;
  updated_at: string;
  marked: boolean;
  voice_notes: string | null;
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
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${BACKEND_BASE_URL}/classes/${assignmentId}/submissions/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access submissions.");
      } else if (response.status === 404) {
        throw new Error("Submissions not found.");
      } else {
        throw new Error("Error retrieving submissions.");
      }
    }

    const data = await response.json();
    console.log("Assignment submissions:", data);
    
    return data || [];
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
} 