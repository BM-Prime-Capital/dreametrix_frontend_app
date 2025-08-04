// services/StudentGradebookService.ts

export interface StudentClass {
  course: string;
  course_id: number;
  class_average: number;
  student_average: number;
  assessments: Assessment[];
}

export interface Assessment {
  assessment_type: string;
  name: string;
  weight: number;
}

export interface Submission {
  assessment: number;
  assessment_name: string;
  assessment_type: string;
  score: number;
  voice_note: string | null;
  marked: boolean;
  submission_id: number;
}

export interface StudentGradebookDetail {
  student: number;
  student_name: string;
  student_email: string;
  student_average: number;
  submissions: Submission[];
}

/**
 * Récupère la liste de tous les cours de l'étudiant avec leurs assessments
 */
export async function getStudentClasses(
  tenantPrimaryDomain: string,
  accessToken: string
): Promise<StudentClass[]> {
  const url = `${tenantPrimaryDomain}/gradebooks/student/classes/`;

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
      console.error("Backend error:", errorData);
      throw new Error(errorData.detail || "Error fetching student classes");
    }

    const data = await response.json();
    console.log("Student classes data:", data);
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

/**
 * Récupère les détails du gradebook pour une classe spécifique de l'étudiant
 */
export async function getStudentClassGradebook(
  classId: string,
  tenantPrimaryDomain: string,
  accessToken: string
): Promise<StudentGradebookDetail[]> {
  const url = `${tenantPrimaryDomain}/gradebooks/student/classes/${classId}/`;

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
      console.error("Backend error:", errorData);
      throw new Error(errorData.detail || "Error fetching class gradebook");
    }

    const data = await response.json();
    console.log("Class gradebook data:", data);
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

/**
 * Calcule les statistiques globales à partir des classes
 */
export function calculateGlobalStats(classes: StudentClass[]) {
  if (!classes || classes.length === 0) {
    return {
      overallAverage: 0,
      totalClasses: 0,
      bestSubject: { name: "", average: 0 },
      totalAssessments: 0
    };
  }

  // Calculer la moyenne globale
  const totalAverage = classes.reduce((sum, cls) => sum + cls.student_average, 0);
  const overallAverage = totalAverage / classes.length;

  // Trouver la meilleure matière
  const bestSubject = classes.reduce((best, current) => 
    current.student_average > best.student_average ? current : best
  );

  // Compter le total d'assessments
  const totalAssessments = classes.reduce((sum, cls) => sum + cls.assessments.length, 0);

  return {
    overallAverage: Math.round(overallAverage * 10) / 10,
    totalClasses: classes.length,
    bestSubject: {
      name: bestSubject.course,
      average: bestSubject.student_average
    },
    totalAssessments
  };
}

/**
 * Calcule les statistiques détaillées pour une classe
 */
export function calculateClassStats(details: StudentGradebookDetail[]) {
  if (!details || details.length === 0) {
    return {
      studentAverage: 0,
      totalSubmissions: 0,
      markedSubmissions: 0,
      averageScore: 0
    };
  }

  const detail = details[0]; // Prendre le premier élément
  const submissions = detail.submissions;

  // Calculer la moyenne des scores
  const validScores = submissions.filter(sub => sub.score > 0);
  const averageScore = validScores.length > 0 
    ? validScores.reduce((sum, sub) => sum + sub.score, 0) / validScores.length 
    : 0;

  // Compter les soumissions marquées
  const markedSubmissions = submissions.filter(sub => sub.marked).length;

  return {
    studentAverage: detail.student_average,
    totalSubmissions: submissions.length,
    markedSubmissions,
    averageScore: Math.round(averageScore * 10) / 10
  };
}

/**
 * Formate les données de classe pour l'affichage
 */
export function formatClassData(classData: StudentClass) {
  const assessmentCounts = {
    test: 0,
    quiz: 0,
    homework: 0,
    participation: 0,
    other: 0,
  };

  classData.assessments.forEach((assessment) => {
    const type = assessment.assessment_type.toLowerCase();
    if (assessmentCounts.hasOwnProperty(type)) {
      assessmentCounts[type as keyof typeof assessmentCounts]++;
    } else {
      assessmentCounts.other++;
    }
  });

  return {
    id: classData.course_id,
    name: classData.course,
    average: `${classData.student_average.toFixed(1)}%`,
    classAverage: `${classData.class_average.toFixed(1)}%`,
    noOfExams: assessmentCounts.test,
    noOfTests: assessmentCounts.quiz,
    noOfHomeworks: assessmentCounts.homework,
    noOfParticipation: assessmentCounts.participation,
    noOfOther: assessmentCounts.other,
    totalWork: Object.values(assessmentCounts).reduce((a, b) => a + b, 0),
    assessments: classData.assessments,
    rawAverage: classData.student_average,
    rawClassAverage: classData.class_average,
  };
} 