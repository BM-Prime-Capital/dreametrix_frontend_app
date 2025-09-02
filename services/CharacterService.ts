import { BACKEND_BASE_URL } from "@/app/utils/constants";

// Interface pour les données character student
export interface StudentCharacterData {
  student_id: number;
  full_name: string;
  ratings: any[];
  summary: {
    total_days_evaluated: number;
    total_good_character: number;
    total_bad_character: number;
    average_good_per_day: number;
    average_bad_per_day: number;
  };
}

// Interface pour les données character parent
export interface ParentCharacterData {
  student_id: number;
  full_name: string;
  ratings: any[];
  summary: {
    total_days_evaluated: number;
    total_good_character: number;
    total_bad_character: number;
    average_good_per_day: number;
    average_bad_per_day: number;
  };
}

export async function getStudentCharacterView(
  accessToken: string
): Promise<StudentCharacterData> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${BACKEND_BASE_URL}/characters/character-ratings/student_view/`;

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
        throw new Error("Vous n'avez pas la permission d'accéder aux characters.");
      } else {
        throw new Error("Erreur lors de la récupération des characters.");
      }
    }

    const data = await response.json();
    console.log("Student character data:", data);
    
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Échec de la connexion au serveur");
  }
}

export async function getParentCharacterView(
  accessToken: string
): Promise<ParentCharacterData[]> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${BACKEND_BASE_URL}/characters/character-ratings/parent_view/`;

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
        throw new Error("Vous n'avez pas la permission d'accéder aux characters.");
      } else {
        throw new Error("Erreur lors de la récupération des characters.");
      }
    }

    const data = await response.json();
    console.log("Parent character data:", data);
    
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Échec de la connexion au serveur");
  }
}
