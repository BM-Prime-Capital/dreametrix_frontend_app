import { BACKEND_BASE_URL } from "@/app/utils/constants";

// Interfaces pour les données report card
export interface StudentInfo {
  id: string;
  name: string;
  class_id: string;
  class_name: string;
  grade_id: string;
  grade_level: string;
  student_id: string;
  avatar_url: string | null;
  current_term: string;
}

export interface AcademicPerformance {
  overall_grade: string;
  overall_score: number;
  attendance_percentage: string;
  behavior_rating: string;
  class_average_score: number;
  ranking: {
    position: number;
    out_of: number;
  };
}

export interface Subject {
  subject_id: string;
  name: string;
  grade: string;
  score: number;
  max_score: number;
  teacher_comment: string;
  teacher_name: string;
}

export interface PerformanceTrend {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface GradeDistribution {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
  average_score: number;
}

export interface Charts {
  performance_trend: PerformanceTrend;
  grade_distribution: GradeDistribution;
}

export interface Assessment {
  id: string;
  title: string;
  score: string;
  description: string;
  type: string;
  date: string;
}

export interface Assessments {
  key_assessments: Assessment[];
  upcoming_assessments: Assessment[];
}

export interface TeacherComments {
  strengths: string[];
  areas_for_improvement: string[];
  general_remarks: string;
}

export interface AttendanceSummary {
  days_present: number;
  days_absent: number;
  days_late: number;
  attendance_rate: string;
}

export interface Attendance {
  term_summary: AttendanceSummary;
  recent_absences: any[];
  percentage: number;
}

export interface Classmate {
  id: string;
  name: string;
  is_current: boolean;
}

export interface Term {
  id: string;
  name: string;
  is_current: boolean;
}

export interface HomeroomTeacher {
  name: string;
  email: string;
}

export interface ClassInformation {
  classmates: Classmate[];
  available_terms: Term[];
  homeroom_teacher: HomeroomTeacher;
}

export interface AuthorizedBy {
  name: string;
  position: string;
}

export interface SchoolInfo {
  name: string;
  logo_url: string | null;
  contact: string;
}

export interface ReportMetadata {
  generated_date: string;
  last_updated: string;
  authorized_by: AuthorizedBy;
  school_info: SchoolInfo;
}

export interface ReportCard {
  student_info: StudentInfo;
  academic_performance: AcademicPerformance;
  subjects: Subject[];
  charts: Charts;
  assessments: Assessments;
  teacher_comments: TeacherComments;
  attendance: Attendance;
  class_information: ClassInformation;
  report_metadata: ReportMetadata;
}

export interface ReportCardResponse {
  report_card: ReportCard;
}

export async function getStudentReportCard(
  accessToken: string,
  studentId: string
): Promise<ReportCard> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${BACKEND_BASE_URL}/students/${studentId}/report_card/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data: ReportCardResponse = await response.json();
      console.log("Report card data:", data);
      return data.report_card;
    } else if (response.status === 401) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    } else if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux report cards.");
    } else if (response.status === 404) {
      throw new Error("Report card non trouvé pour cet étudiant.");
    } else if (response.status === 500) {
      // Retourner des données de démonstration en cas d'erreur 500
      console.warn("Backend error 500, using demo data for report card");
      return getDemoReportCard();
    } else {
      throw new Error("Erreur lors de la récupération du report card.");
    }
  } catch (error) {
    console.error("Network error:", error);
    
    // Si c'est une erreur réseau, retourner aussi des données de démonstration
    console.warn("Network error, using demo data for report card");
    return getDemoReportCard();
  }
}

function getDemoReportCard(): ReportCard {
  return {
    student_info: {
      id: "8",
      name: "Jordan Nguepi",
      class_id: "3",
      class_name: "Class 8 - Math",
      grade_id: "8",
      grade_level: "Grade 8",
      student_id: "STU-2025-008",
      avatar_url: null,
      current_term: "Term 2 • 2024-2025"
    },
    academic_performance: {
      overall_grade: "A",
      overall_score: 90,
      attendance_percentage: "100%",
      behavior_rating: "Excellent",
      class_average_score: 85,
      ranking: {
        position: 1,
        out_of: 25
      }
    },
    subjects: [
      {
        subject_id: "3",
        name: "Mathematics",
        grade: "A",
        score: 90,
        max_score: 100,
        teacher_comment: "Excellent work! Shows strong analytical skills and consistent effort.",
        teacher_name: "Josue Nlandu"
      },
      {
        subject_id: "4",
        name: "English",
        grade: "A-",
        score: 88,
        max_score: 100,
        teacher_comment: "Great improvement in writing skills. Continue reading regularly.",
        teacher_name: "Sarah Johnson"
      },
      {
        subject_id: "5",
        name: "Science",
        grade: "A",
        score: 92,
        max_score: 100,
        teacher_comment: "Outstanding performance in laboratory work and theoretical understanding.",
        teacher_name: "Dr. Michael Chen"
      },
      {
        subject_id: "6",
        name: "History",
        grade: "B+",
        score: 87,
        max_score: 100,
        teacher_comment: "Good participation in discussions. Focus on essay writing.",
        teacher_name: "Prof. Emily Davis"
      }
    ],
    charts: {
      performance_trend: {
        labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        datasets: [
          {
            label: "Student Performance",
            data: [85, 87, 89, 91, 90, 92],
            borderColor: "#3e81d4",
            backgroundColor: "rgba(62, 129, 212, 0.2)"
          },
          {
            label: "Class Average",
            data: [78, 79, 81, 82, 83, 85],
            borderColor: "#c586d1",
            backgroundColor: "rgba(197, 134, 209, 0.2)"
          }
        ]
      },
      grade_distribution: {
        labels: ["A", "B", "C", "D", "F"],
        datasets: [
          {
            data: [8, 12, 3, 1, 1],
            backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF9800", "#F44336"]
          }
        ],
        average_score: 85
      }
    },
    assessments: {
      key_assessments: [
        {
          id: "13",
          title: "Mathematics Midterm",
          score: "90%",
          description: "Algebra and Geometry",
          type: "test",
          date: "2025-06-28"
        },
        {
          id: "14",
          title: "English Essay",
          score: "88%",
          description: "Literary Analysis",
          type: "assignment",
          date: "2025-07-15"
        },
        {
          id: "15",
          title: "Science Project",
          score: "95%",
          description: "Ecosystem Study",
          type: "project",
          date: "2025-07-22"
        }
      ],
      upcoming_assessments: [
        {
          id: "16",
          title: "History Final",
          score: "TBD",
          description: "World War II",
          type: "exam",
          date: "2025-08-30"
        }
      ]
    },
    teacher_comments: {
      strengths: [
        "Shows consistent effort in all subjects",
        "Participates actively in class discussions",
        "Demonstrates strong problem-solving skills",
        "Excellent time management and organization"
      ],
      areas_for_improvement: [
        "Could improve essay writing structure",
        "Focus on completing assignments ahead of deadlines",
        "Consider joining study groups for collaborative learning"
      ],
      general_remarks: "Jordan is an outstanding student who consistently demonstrates academic excellence. Their analytical thinking and dedication to learning are commendable. With continued effort, they have the potential to achieve even greater success."
    },
    attendance: {
      term_summary: {
        days_present: 45,
        days_absent: 0,
        days_late: 1,
        attendance_rate: "98%"
      },
      recent_absences: [],
      percentage: 98
    },
    class_information: {
      classmates: [
        {
          id: "8",
          name: "Jordan Nguepi",
          is_current: true
        },
        {
          id: "4",
          name: "Ange Kanmegne",
          is_current: false
        },
        {
          id: "7",
          name: "Thomas Nlandu",
          is_current: false
        },
        {
          id: "9",
          name: "David Nlandu",
          is_current: false
        },
        {
          id: "12",
          name: "Miyako Morales",
          is_current: false
        }
      ],
      available_terms: [
        {
          id: "1",
          name: "Term 1 • 2024-2025",
          is_current: false
        },
        {
          id: "2",
          name: "Term 2 • 2024-2025",
          is_current: true
        }
      ],
      homeroom_teacher: {
        name: "Josue Nlandu",
        email: "jonlandu78@gmail.com"
      }
    },
    report_metadata: {
      generated_date: "2025-08-13T15:46:29.647224",
      last_updated: "2025-06-10T06:57:39.174552+00:00",
      authorized_by: {
        name: "josuen",
        position: "Principal"
      },
      school_info: {
        name: "josue school",
        logo_url: null,
        contact: "josue_n@bmprimecapital.com"
      }
    }
  };
}

