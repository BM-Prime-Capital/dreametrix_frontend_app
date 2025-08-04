import { useState, useEffect } from "react";
import { 
  getParentAssignments, 
  getChildAssignments, 
  getAssignmentDetails,
  getAssignmentSubmission,
  ParentAssignment,
  Submission
} from "@/services/ParentAssignmentService";

interface UseParentAssignmentsProps {
  accessToken: string;
  refreshToken: string;
  childId?: number;
  filters?: {
    student_id?: number;
    class_id?: number;
    course_id?: number;
    date_from?: string;
    date_to?: string;
    published?: boolean;
  };
}

interface UseParentAssignmentsReturn {
  assignments: ParentAssignment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useParentAssignments({
  accessToken,
  refreshToken,
  childId,
  filters
}: UseParentAssignmentsProps): UseParentAssignmentsReturn {
  const [assignments, setAssignments] = useState<ParentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    if (!accessToken) {
      setError("Access token is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let data: ParentAssignment[];

      if (childId) {
        // Fetch assignments for a specific child
        data = await getChildAssignments(childId, accessToken, refreshToken, filters);
      } else {
        // Fetch assignments for all children
        data = await getParentAssignments(accessToken, refreshToken, filters);
      }

      setAssignments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch assignments";
      setError(errorMessage);
      console.error("Error fetching parent assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [accessToken, refreshToken, childId, JSON.stringify(filters)]);

  const refetch = async () => {
    await fetchAssignments();
  };

  return {
    assignments,
    loading,
    error,
    refetch
  };
}

interface UseAssignmentDetailsProps {
  assignmentId: number | null;
  accessToken: string;
}

interface UseAssignmentDetailsReturn {
  assignment: ParentAssignment | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAssignmentDetails({
  assignmentId,
  accessToken
}: UseAssignmentDetailsProps): UseAssignmentDetailsReturn {
  const [assignment, setAssignment] = useState<ParentAssignment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignmentDetails = async () => {
    if (!assignmentId || !accessToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getAssignmentDetails(assignmentId, accessToken);
      setAssignment(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch assignment details";
      setError(errorMessage);
      console.error("Error fetching assignment details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentDetails();
    }
  }, [assignmentId, accessToken]);

  const refetch = async () => {
    await fetchAssignmentDetails();
  };

  return {
    assignment,
    loading,
    error,
    refetch
  };
}

interface UseAssignmentSubmissionProps {
  assignmentId: number | null;
  accessToken: string;
}

interface UseAssignmentSubmissionReturn {
  submission: Submission[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAssignmentSubmission({
  assignmentId,
  accessToken
}: UseAssignmentSubmissionProps): UseAssignmentSubmissionReturn {
  const [submission, setSubmission] = useState<Submission[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmission = async () => {
    if (!assignmentId || !accessToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getAssignmentSubmission(assignmentId, accessToken);
      setSubmission(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch assignment submission";
      setError(errorMessage);
      console.error("Error fetching assignment submission:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchSubmission();
    }
  }, [assignmentId, accessToken]);

  const refetch = async () => {
    await fetchSubmission();
  };

  return {
    submission,
    loading,
    error,
    refetch
  };
} 