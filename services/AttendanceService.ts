/* eslint-disable @typescript-eslint/no-explicit-any */
import { BACKEND_BASE_URL } from "@/app/utils/constants";

// Interface for student attendance data
export interface StudentAttendanceData {
  student_id: number;
  full_name: string;
  attendances: {
    id: number;
    date: string;
    status: string;
    course: {
      id: number;
      name: string;
      subject: {
        full: string;
        short: string;
      };
    };
    teacher: {
      id: number;
      name: string;
      email: string;
    };
  }[];
  statistics: {
    total_days: number;
    present_days: number;
    absent_days: number;
    late_days: number;
  };
  summary: {
    total_days: number;
    present: number;
    absent: number;
    late: number;
    half_day: number;
    attendance_rate: number;
  };
}

// Interface for parent attendance data
export interface ParentAttendanceData {
  children_attendance: {
    student_id: number;
    full_name: string;
    attendances: {
      id: number;
      date: string;
      status: string;
      course: {
        id: number;
        name: string;
        subject: {
          full: string;
          short: string;
        };
      };
      teacher: {
        id: number;
        name: string;
        email: string;
      };
    }[];
    statistics: {
      total_days: number;
      present_days: number;
      absent_days: number;
      late_days: number;
    };
    summary: {
      total_days: number;
      present: number;
      absent: number;
      late: number;
      half_day: number;
      attendance_rate: number;
    };
  }[];
}

// Interface for attendance data
export interface Attendance {
  attendance_id: number;
  student: {
    id: number;
    user: {
      username: string;
      first_name?: string;
      last_name?: string;
    };
  };
  status: 'present' | 'absent' | 'late' | 'half_day';
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Interface for attendance statistics
export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  half_day: number;
  total: number;
}

// Interface for attendance filters
export interface AttendanceFilters {
  date: string;
  class_id: number;
  teacher_id: number;
  student_id?: number;
}

// Function to get student attendance view
export async function getStudentAttendanceView(
  accessToken: string,
  limit?: number,
  offset?: number
): Promise<StudentAttendanceData> {
  if (!accessToken) {
    throw new Error("You are not connected. Please log in again.");
  }

  let url = `${BACKEND_BASE_URL}/attendances/student_view/`;
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

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
        throw new Error("You don't have permission to access attendances.");
      } else {
        throw new Error("Error while fetching attendances.");
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

// Function to get parent attendance view
export async function getParentAttendanceView(
  accessToken: string,
  limit?: number,
  offset?: number
): Promise<ParentAttendanceData> {
  if (!accessToken) {
    throw new Error("You are not connected. Please log in again.");
  }

  let url = `${BACKEND_BASE_URL}/attendances/parent_view/`;
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

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
        throw new Error("You don't have permission to access attendances.");
      } else {
        throw new Error("Error while fetching attendances.");
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

export const getAttendanceGeneralView = () => {

  // Implement the function logic here

};

// Function to get attendances
export async function getAttendances(
  filters: AttendanceFilters,
  tenantDomain: string,
  accessToken: string,
  refreshToken: string
): Promise<Attendance[]> {
  try {
    const params = new URLSearchParams({
      date: filters.date,
      class_id: filters.class_id.toString(),
      teacher_id: filters.teacher_id.toString(),
    });

    if (filters.student_id) {
      params.append('student_id', filters.student_id.toString());
    }

    const url = `${BACKEND_BASE_URL}/attendances/?${params.toString()}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Tenant-Domain": tenantDomain,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAuthToken(refreshToken, tenantDomain);
        if (refreshed) {
          // Retry with new token
          return getAttendances(filters, tenantDomain, refreshed.accessToken, refreshed.refreshToken);
        }
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access attendances.");
      } else if (response.status === 404) {
        // No attendances found for this date
        return [];
      } else {
        throw new Error("Error while fetching attendances.");
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAttendances:", error);
    throw new Error("Failed to fetch attendances");
  }
}

export async function updateAttendances(
  filters: AttendanceFilters,
  tenantDomain: string,
  accessToken: string,
  refreshToken: string
): Promise<Attendance[]> {
  try {
    const params = new URLSearchParams({
      date: filters.date,
      class_id: filters.class_id.toString(),
      teacher_id: filters.teacher_id.toString(),
    });

    if (filters.student_id) {
      params.append('student_id', filters.student_id.toString());
    }

    const url = `${BACKEND_BASE_URL}/attendances/?${params.toString()}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Tenant-Domain": tenantDomain,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAuthToken(refreshToken, tenantDomain);
        if (refreshed) {
          // Retry with new token
          return getAttendances(filters, tenantDomain, refreshed.accessToken, refreshed.refreshToken);
        }
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access attendances.");
      } else if (response.status === 404) {
        // No attendances found for this date
        return [];
      } else {
        throw new Error("Error while fetching attendances.");
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAttendances:", error);
    throw new Error("Failed to fetch attendances");
  }
}

// Function to get student attendance statistics
export async function getStudentAttendanceStats(
  studentId: number,
  tenantDomain: string,
  accessToken: string,
  refreshToken: string
): Promise<AttendanceStats> {
  try {
    const url = `${BACKEND_BASE_URL}/attendances/student/${studentId}/stats/`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Tenant-Domain": tenantDomain,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAuthToken(refreshToken, tenantDomain);
        if (refreshed) {
          // Retry with new token
          return getStudentAttendanceStats(studentId, tenantDomain, refreshed.accessToken, refreshed.refreshToken);
        }
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access statistics.");
      } else if (response.status === 404) {
        // No stats found, return default values
        return {
          present: 0,
          absent: 0,
          late: 0,
          half_day: 0,
          total: 0
        };
      } else {
        throw new Error("Error while fetching statistics.");
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getStudentAttendanceStats:", error);
    // Return default values even in case of error
    return {
      present: 0,
      absent: 0,
      late: 0,
      half_day: 0,
      total: 0
    };
  }
}

// Function to update attendance
export async function updateAttendance(
  attendanceData: {
    attendance_id: number;
    status: string;
    notes: string;
    oldStatus?: string;
    student?: {
      id: number;
    };
  },
  tenantDomain: string,
  accessToken: string,
  refreshToken: string
): Promise<any> {
  try {
    const url = `${BACKEND_BASE_URL}/attendances/${attendanceData.attendance_id}/`;
    
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Tenant-Domain": tenantDomain,
      },
      body: JSON.stringify({
        status: attendanceData.status,
        notes: attendanceData.notes,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAuthToken(refreshToken, tenantDomain);
        if (refreshed) {
          // Retry with new token
          return updateAttendance(attendanceData, tenantDomain, refreshed.accessToken, refreshed.refreshToken);
        }
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to update attendances.");
      } else {
        throw new Error("Error while updating attendance.");
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in updateAttendance:", error);
    throw new Error("Failed to update attendance");
  }
}

// Function to update multiple attendances
export async function updateMultipleAttendances(
  data: {
    updates: Array<{
      attendance_id: number;
      status: string;
      notes: string;
      oldStatus?: string;
    }>;
  },
  tenantDomain: string,
  accessToken: string,
  refreshToken: string
): Promise<any> {
  try {
    const url = `${BACKEND_BASE_URL}/attendances/bulk_update/`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Tenant-Domain": tenantDomain,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAuthToken(refreshToken, tenantDomain);
        if (refreshed) {
          // Retry with new token
          return updateMultipleAttendances(data, tenantDomain, refreshed.accessToken, refreshed.refreshToken);
        }
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to update attendances.");
      } else {
        throw new Error("Error while updating attendances.");
      }
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in updateMultipleAttendances:", error);
    throw new Error("Failed to update multiple attendances");
  }
}

// Function to initialize attendances
export async function initializeAttendances(
  data: {
    date: string;
    class_id: number;
    teacher_id: number;
  },
  tenantDomain: string,
  accessToken: string,
  refreshToken: string
): Promise<Attendance[]> {
  try {
    const url = `${BACKEND_BASE_URL}/attendances/initialize/`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Tenant-Domain": tenantDomain,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAuthToken(refreshToken, tenantDomain);
        if (refreshed) {
          // Retry with new token
          return initializeAttendances(data, tenantDomain, refreshed.accessToken, refreshed.refreshToken);
        }
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to initialize attendances.");
      } else if (response.status === 409) {
        throw new Error("Attendances already exist for this date.");
      } else {
        throw new Error("Error while initializing attendances.");
      }
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in initializeAttendances:", error);
    throw new Error("Failed to initialize attendances");
  }
}

// Utility function to refresh authentication token
async function refreshAuthToken(refreshToken: string, tenantDomain: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const url = `${BACKEND_BASE_URL}/auth/refresh/`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Domain": tenantDomain,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.access,
      refreshToken: data.refresh || refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}