
export interface UnitPlan {
  id: string;
  title: string;
  subject: Subject;
  gradeLevel: string;
  standards: string;
  learningObjectives: string;
  assessmentsFormative: string;
  assessmentsSummative: string;
  activities: string;
  materials: string;
  pacingCalendar: string;
  startDate?: string;
  endDate?: string;
}

export interface LessonPlan {
  id: string;
  unitPlanId?: string; // Optional: Link to UnitPlan
  title: string;
  date: string;
  subject: Subject | undefined;
  gradeLevel: string;
  objectives: string;
  procedures: string;
  materials: string;
  differentiation?: string;
  assessmentFormative: string;
}

export interface ScopeAndSequence {
  id: string;
  title: string;
  academicYear: string; // e.g., "2024-2025"
  subject: Subject;
  gradeLevel: string;
  overview: string; // General description of the year's curriculum trajectory
  standardsAndUnitsByMonth: string; // A textarea for chronological listing of learning standards by unit and month
}

export type Subject = 'ELA' | 'Math';
export const SUBJECTS: Subject[] = ['ELA', 'Math'];

export const GRADE_LEVELS: string[] = [
  "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade",
  "5th Grade", "6th Grade", "7th Grade", "8th Grade",
];
