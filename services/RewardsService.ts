import { BACKEND_BASE_URL } from "@/app/utils/constants";

// Interface pour les données rewards student
export interface StudentRewardsData {
  student: {
    name: string;
    totalPoints: number;
    goodDomains: string[];
    focusDomains: string[];
    attendanceBalance: {
      present: number;
      absent: number;
      late: number;
      half_day: number;
    };
    goodCharacter: Record<string, number>;
    badCharacter: Record<string, number>;
    latestNews: {
      date: string;
      period: string;
      class: string;
      status: 'good' | 'bad';
      newsAndComment: string;
      sanctions: string;
      created_at: string;
      points: number;
      followUp: {
        edit: boolean;
        delete: boolean;
      };
    }[];
  };
}

// Interface pour les données rewards parent
export interface ParentRewardsData {
  student_id: number;
  full_name: string;
  report: {
    totalPoints: number;
    goodDomains: string[];
    focusDomains: string[];
    attendanceBalance: {
      present: number;
      absent: number;
      late: number;
      half_day: number;
    };
    goodCharacter: Record<string, number>;
    badCharacter: Record<string, number>;
    latestNews: {
      date: string;
      period: string;
      class: string;
      status: 'good' | 'bad';
      newsAndComment: string;
      sanctions: string;
      created_at: string;
      points: number;
      followUp: {
        edit: boolean;
        delete: boolean;
      };
    }[];
  };
}

export async function getStudentRewardsView(
  accessToken: string
): Promise<StudentRewardsData> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${BACKEND_BASE_URL}/rewards/student-reports/student_view/`;

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
        throw new Error("Vous n'avez pas la permission d'accéder aux rewards.");
      } else {
        throw new Error("Erreur lors de la récupération des rewards.");
      }
    }

    const data = await response.json();
    console.log("Student rewards data:", data);
    
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Échec de la connexion au serveur");
  }
}

export async function getStudentRewardsDetail(
  accessToken: string,
  studentId: number
): Promise<StudentRewardsData> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${BACKEND_BASE_URL}/rewards/student-reports/${studentId}/student_detail/`;

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
        throw new Error("Vous n'avez pas la permission d'accéder aux rewards.");
      } else {
        throw new Error("Erreur lors de la récupération des rewards.");
      }
    }

    const data = await response.json();
    console.log("Student rewards detail data:", data);
    
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Échec de la connexion au serveur");
  }
}

export async function getParentRewardsView(
  accessToken: string
): Promise<ParentRewardsData[]> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${BACKEND_BASE_URL}/rewards/student-reports/parent_view/`;

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
        throw new Error("Vous n'avez pas la permission d'accéder aux rewards.");
      } else {
        throw new Error("Erreur lors de la récupération des rewards.");
      }
    }

    const data = await response.json();
    console.log("Parent rewards data:", data);
    
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Échec de la connexion au serveur");
  }
}