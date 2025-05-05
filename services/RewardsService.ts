"use server";

export async function getRewardsGeneralView(
tenantPrimaryDomain: string, accessToken: string, refreshToken: string, fromDate: string, toDate: string, id: any) {
  if (!accessToken) {
    throw new Error("You're not authenticated. Please reload or try again!");
  }
  
  const url = `${tenantPrimaryDomain}/rewards/student-reports/`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("Error response => ", response);
    if (response.status === 403) {
      throw new Error("You don't have permission to access this data.");
    } else {
      throw new Error("Error while fetching rewards data.");
    }
  }

  try {
    const data = await response.json();
    return formatRewardData(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("Invalid data format received from server");
  }
}

function formatRewardData(data: any) {
  // Vérification de la structure de base des données
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid data format: expected an object");
  }

  // Vérification des résultats
  const results = typeof data.results === 'number' ? data.results : 0;

  // Vérification des classes
  const classes = Array.isArray(data.classes) 
    ? data.classes.map((classItem: any) => {
        // Vérification de chaque classe
        const className = classItem?.className || 'Unknown Class';
        
        // Vérification des étudiants
        const students = Array.isArray(classItem.students) 
          ? classItem.students.map((studentItem: any) => ({
              student: {
                id: studentItem?.student?.id || 0,
                name: studentItem?.student?.name || 'Unknown Student',
              },
              attendance: studentItem?.attendance || {
                present: 0,
                absent: 0,
                late: 0,
                half_day: 0
              },
              pointGained: studentItem?.pointGained || 0,
              pointLost: studentItem?.pointLost || 0,
              total: studentItem?.total || 0,
              created_at: studentItem?.created_at || null,
              updated_at: studentItem?.updated_at || null,
              date: studentItem?.date || null,
            }))
          : [];

        return {
          className,
          students
        };
      })
    : [];

  return {
    results,
    classes
  };
}


export async function getRewardsFocusView(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string,
  fromDate: string,
  toDate: string,
  studentId: string
) {
  // Validation plus explicite des paramètres
  if (!tenantPrimaryDomain || !accessToken) {
    throw new Error("Domain and authentication token are required");
  }

  if (!studentId) {
    throw new Error("Student ID is required");
  }

  try {
    const url = new URL(
      `rewards/student-reports/${studentId}/student_detail/`,
      tenantPrimaryDomain
    ).toString();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Tentative de récupération du message d'erreur du serveur
      let errorMessage = "Error while fetching student data";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.warn("Could not parse error response", e);
      }

      // Gestion spécifique des codes d'erreur
      if (response.status === 401) {
        errorMessage = "Authentication expired. Please refresh your session.";
      } else if (response.status === 403) {
        errorMessage = "You don't have permission to access this data.";
      } else if (response.status === 404) {
        errorMessage = "Student data not found.";
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return formatStudentDataFocusViews(data);
  } catch (error) {
    console.error("API call failed:", error);
    
    // Amélioration des messages d'erreur
    if (error instanceof TypeError) {
      throw new Error("Network error occurred. Please check your connection.");
    }
    
    throw error instanceof Error 
      ? error 
      : new Error("An unexpected error occurred");
  }
}

interface StudentNewsItem {
  date: string | null;
  period: string | null;
  class: string | null;
  status: string | null;
  newsAndComment: string | null;
  sanctions: string | null;
  created_at: string | null;
  points: number;
  followUp: {
    edit: boolean;
    delete: boolean;
  };
}

interface FormattedStudentData {
  studentName: string;
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
  latestNews: StudentNewsItem[];
}

function formatStudentDataFocusViews(data: any): FormattedStudentData {
  if (!data || typeof data !== 'object') {
    console.error("Invalid data format received:", data);
    throw new Error("Invalid data format: expected an object");
  }

  // Valeurs par défaut structurées
  const defaultAttendance = { 
    present: 0, 
    absent: 0, 
    late: 0, 
    half_day: 0 
  };

  const student = data.student || {};
  
  // Validation des données avec des messages d'erreur plus précis
  if (!student.name) {
    console.warn("Student name not found in response", student);
  }

  // Formatage des news avec validation
  const formatNewsItem = (item: any): StudentNewsItem => {
    if (!item) return {
      date: null,
      period: null,
      class: null,
      status: null,
      newsAndComment: null,
      sanctions: null,
      created_at: null,
      points: 0,
      followUp: { edit: false, delete: false }
    };

    return {
      date: item.date || null,
      period: item.period || null,
      class: item.class || null,
      status: item.status || null,
      newsAndComment: item.newsAndComment || null,
      sanctions: item.sanctions || null,
      created_at: item.created_at || null,
      points: typeof item.points === 'number' ? item.points : 0,
      followUp: {
        edit: Boolean(item.followUp?.edit),
        delete: Boolean(item.followUp?.delete)
      }
    };
  };

  return {
    studentName: student.name || 'Unknown Student',
    totalPoints: typeof student.totalPoints === 'number' ? student.totalPoints : 0,
    goodDomains: Array.isArray(student.goodDomains) 
      ? student.goodDomains.filter((d: any) => typeof d === 'string')
      : [],
    focusDomains: Array.isArray(student.focusDomains)
      ? student.focusDomains.filter((d: any) => typeof d === 'string')
      : [],
    attendanceBalance: student.attendanceBalance 
      ? { ...defaultAttendance, ...student.attendanceBalance }
      : defaultAttendance,
    goodCharacter: student.goodCharacter && typeof student.goodCharacter === 'object'
      ? student.goodCharacter
      : {},
    badCharacter: student.badCharacter && typeof student.badCharacter === 'object'
      ? student.badCharacter
      : {},
    latestNews: Array.isArray(student.latestNews)
      ? student.latestNews.map(formatNewsItem)
      : []
  };
}