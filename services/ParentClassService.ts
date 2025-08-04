import { BACKEND_BASE_URL } from '@/app/utils/constants';

// Interface pour les données brutes de l'API
interface ApiClass {
  id: number;
  name: string;
  subject_in_all_letter: string;
  subject_in_short: string;
  hours_and_dates_of_course_schedule: any;
  description: string;
  grade: string;
  created_at: string;
  updated_at: string;
  teacher: {
    id: number;
    full_name: string;
  };
  students: {
    id: number;
    full_name: string;
  }[];
}

export interface ParentClass {
  id: number;
  name: string;
  subject: string;
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  schedule: {
    day: string;
    time: string;
  }[];
  level: string;
  students: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface ParentClassDetails extends ParentClass {
  description?: string;
  assessment_weights?: {
    [key: string]: number;
  };
  statistics?: {
    total_students: number;
    total_submissions?: number;
    graded_submissions?: number;
    average_grade?: number;
    attendance_rate?: number;
  };
}

/**
 * Récupère toutes les classes pour un parent
 */
export async function getParentClasses(
  accessToken: string,
  refreshToken: string,
  childId?: number
): Promise<ParentClass[]> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${BACKEND_BASE_URL}/classes/`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    } else if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux classes.");
    } else {
      throw new Error("Erreur lors de la récupération des classes.");
    }
  }

  const data = await response.json();
  const apiClasses = data.results || data;
  
  // Transformer les données de l'API vers notre interface
  return apiClasses.map((apiClass: ApiClass): ParentClass => {
    // Extraire le prénom et nom de famille du nom complet
    const teacherNameParts = apiClass.teacher.full_name.split(' ');
    const teacherFirstName = teacherNameParts[0] || '';
    const teacherLastName = teacherNameParts.slice(1).join(' ') || '';

    // Transformer les étudiants
    const students = apiClass.students.map(student => {
      const studentNameParts = student.full_name.split(' ');
      const studentFirstName = studentNameParts[0] || '';
      const studentLastName = studentNameParts.slice(1).join(' ') || '';
      
      return {
        id: student.id,
        first_name: studentFirstName,
        last_name: studentLastName,
        email: '' // L'API ne fournit pas l'email des étudiants
      };
    });

    // Transformer les horaires (pour l'instant, on utilise une structure par défaut)
    const schedule = Object.keys(apiClass.hours_and_dates_of_course_schedule || {}).map(day => ({
      day: day,
      time: 'À définir' // L'API ne fournit pas les heures précises
    }));

    return {
      id: apiClass.id,
      name: apiClass.name,
      subject: apiClass.subject_in_all_letter,
      teacher: {
        id: apiClass.teacher.id,
        first_name: teacherFirstName,
        last_name: teacherLastName,
        email: '' // L'API ne fournit pas l'email du professeur
      },
      schedule: schedule,
      level: apiClass.grade,
      students: students,
      created_at: apiClass.created_at,
      updated_at: apiClass.updated_at
    };
  });
}

/**
 * Récupère les détails d'une classe spécifique
 */
export async function getParentClassDetails(
  classId: number,
  accessToken: string,
  refreshToken: string
): Promise<ParentClassDetails> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${BACKEND_BASE_URL}/classes/${classId}/`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    } else if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder à cette classe.");
    } else if (response.status === 404) {
      throw new Error("Classe non trouvée.");
    } else {
      throw new Error("Erreur lors de la récupération des détails de la classe.");
    }
  }

  const data = await response.json();
  const apiClass: ApiClass = data;
  
  // Extraire le prénom et nom de famille du nom complet
  const teacherNameParts = apiClass.teacher.full_name.split(' ');
  const teacherFirstName = teacherNameParts[0] || '';
  const teacherLastName = teacherNameParts.slice(1).join(' ') || '';

  // Transformer les étudiants
  const students = apiClass.students.map(student => {
    const studentNameParts = student.full_name.split(' ');
    const studentFirstName = studentNameParts[0] || '';
    const studentLastName = studentNameParts.slice(1).join(' ') || '';
    
    return {
      id: student.id,
      first_name: studentFirstName,
      last_name: studentLastName,
      email: '' // L'API ne fournit pas l'email des étudiants
    };
  });

  // Transformer les horaires
  const schedule = Object.keys(apiClass.hours_and_dates_of_course_schedule || {}).map(day => ({
    day: day,
    time: 'À définir' // L'API ne fournit pas les heures précises
  }));

  return {
    id: apiClass.id,
    name: apiClass.name,
    subject: apiClass.subject_in_all_letter,
    teacher: {
      id: apiClass.teacher.id,
      first_name: teacherFirstName,
      last_name: teacherLastName,
      email: '' // L'API ne fournit pas l'email du professeur
    },
    schedule: schedule,
    level: apiClass.grade,
    students: students,
    created_at: apiClass.created_at,
    updated_at: apiClass.updated_at,
    description: apiClass.description,
    assessment_weights: undefined, // L'API ne fournit pas ces données
    statistics: {
      total_students: students.length,
      average_grade: undefined,
      attendance_rate: undefined
    }
  };
}

/**
 * Récupère les classes par enfant
 */
export async function getParentClassesByChild(
  childId: number,
  accessToken: string,
  refreshToken: string
): Promise<ParentClass[]> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${BACKEND_BASE_URL}/classes/by_child/?child_id=${childId}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    } else if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux classes de cet enfant.");
    } else {
      throw new Error("Erreur lors de la récupération des classes de l'enfant.");
    }
  }

  const data = await response.json();
  return data.results || data;
} 