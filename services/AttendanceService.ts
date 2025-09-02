import { BACKEND_BASE_URL } from "@/app/utils/constants";

// Interface pour les données attendance student
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

// Interface pour les données attendance parent
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

export async function getStudentAttendanceView(
  accessToken: string,
  limit?: number,
  offset?: number
): Promise<StudentAttendanceData> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
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
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      } else if (response.status === 403) {
        throw new Error("Vous n'avez pas la permission d'accéder aux présences.");
      } else {
        throw new Error("Erreur lors de la récupération des présences.");
      }
    }

    const data = await response.json();
    console.log("Student attendance data:", data);
    
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Échec de la connexion au serveur");
  }
}

export async function getParentAttendanceView(
  accessToken: string,
  limit?: number,
  offset?: number
): Promise<ParentAttendanceData> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
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
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      } else if (response.status === 403) {
        throw new Error("Vous n'avez pas la permission d'accéder aux présences.");
      } else {
        throw new Error("Erreur lors de la récupération des présences.");
      }
    }

    const data = await response.json();
    console.log("Parent attendance data:", data);
    
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Échec de la connexion au serveur");
  }
}