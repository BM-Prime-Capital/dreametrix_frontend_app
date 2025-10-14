export type Subject = 'ELA' | 'Math' | 'Science' | string;
export const SUBJECTS: Subject[] = ['ELA', 'Math', 'Science'];

export type GradeLevel = 
  | "Kindergarten" 
  | "1st Grade" 
  | "2nd Grade" 
  | "3rd Grade" 
  | "4th Grade"
  | "5th Grade" 
  | "6th Grade" 
  | "7th Grade" 
  | "8th Grade" 
  | "9th Grade" 
  | "10th Grade" 
  | "11th Grade" 
  | "12th Grade"
  | string;

export const GRADE_LEVELS: GradeLevel[] = [
  "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade",
  "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", 
  "10th Grade", "11th Grade", "12th Grade"
]

// Standards NY spécifiques
export const NY_STANDARDS = {
  MATH: [
    "NY-NGLS.MATH.CONTENT.1.OA.A.1",
    "NY-NGLS.MATH.CONTENT.2.NBT.A.1",
    "NY-NGLS.MATH.CONTENT.3.MD.B.3",
    "NY-NGLS.MATH.CONTENT.4.NF.B.3",
    "NY-NGLS.MATH.CONTENT.5.NBT.B.5",
    "NY-NGLS.MATH.CONTENT.6.RP.A.1",
    "NY-NGLS.MATH.CONTENT.7.SP.A.1",
    "NY-NGLS.MATH.CONTENT.8.EE.A.1",
    "NY-NGLS.MATH.CONTENT.HSN.Q.A.1"
  ],
  ELA: [
    "NY-NGLS.ELA-LITERACY.RL.1.1",
    "NY-NGLS.ELA-LITERACY.RI.2.1",
    "NY-NGLS.ELA-LITERACY.RF.3.3",
    "NY-NGLS.ELA-LITERACY.W.4.1",
    "NY-NGLS.ELA-LITERACY.SL.5.1",
    "NY-NGLS.ELA-LITERACY.L.6.1",
    "NY-NGLS.ELA-LITERACY.RH.6-8.1",
    "NY-NGLS.ELA-LITERACY.WHST.9-10.1"
  ],
  SCIENCE: [
    "NY-PSLS.1-PS4-1",
    "NY-PSLS.2-LS2-1",
    "NY-PSLS.3-PS2-1",
    "NY-PSLS.4-ESS1-1",
    "NY-PSLS.5-PS1-1",
    "NY-PSLS.MS-PS1-1",
    "NY-PSLS.HS-PS1-1"
  ]
} as const;

// Types principaux unifiés - VERSION API
export interface ScopeAndSequence {
  // Champs de l'API (snake_case)
  id: string;
  title: string;
  academic_year: string;
  course: number;
  course_name: string;
  subject_name: string;
  grade: string;
  overview: string;
  entries: ScopeSequenceEntry[];
  created_by: number;
  created_at: string;
  updated_at: string;
  
  // Champs compatibilité (camelCase - optionnels)
  academicYear?: string;
  subject?: Subject;
  gradeLevel?: GradeLevel;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Pour la compatibilité avec l'ancien format mock
  standardsAndUnitsByMonth?: string;
}

export interface ScopeSequenceEntry {
  id: string;
  month: string;
  topic: string;
  standard_code: string;
  learning_objective: string;
  essential_questions?: string;
  vocabulary?: string;
  resources: string;
  formative_assessments: string;
  summative_assessments: string;
  duration_weeks: number;
  
  // Compatibilité camelCase
  standardCode?: string;
  learningObjective?: string;
  essentialQuestions?: string;
  formativeAssessments?: string;
  summativeAssessments?: string;
  durationWeeks?: number;
}

export interface UnitPlan {
  // Champs de l'API (snake_case)
  id: string;
  title: string;
  course: number;
  course_name: string;
  subject_name: string;
  grade: string;
  scope_sequence?: string;
  scope_sequence_title?: string;
  duration_weeks: number;
  start_date?: string;
  end_date?: string;
  big_idea?: string;
  essential_questions: string;
  standards: string;
  learning_objectives: string;
  assessments_formative: string;
  assessments_summative: string;
  activities: string;
  materials: string;
  pacing_calendar: string;
  differentiation_strategies?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  
  // Champs compatibilité (camelCase - optionnels)
  subject?: Subject;
  gradeLevel?: GradeLevel;
  scopeSequenceId?: string;
  startDate?: string;
  endDate?: string;
  bigIdea?: string;
  essentialQuestions?: string;
  learningObjectives?: string;
  assessmentsFormative?: string;
  assessmentsSummative?: string;
  differentiationStrategies?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LessonPlan {
  id: string;
  title: string;
  date: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  unitPlanId?: string;
  durationMinutes: number;
  objectives: string;
  standards: string;
  procedures: string;
  materials: string;
  differentiation?: string;
  assessmentFormative: string;
  homework?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Version simplifiée pour les formulaires
export interface LessonProcedure {
  time: number;
  activity: string;
  description: string;
  teacherActions: string;
  studentActions: string;
}

// Types pour les formulaires avec validation Zod
export interface ScopeAndSequenceFormData {
  academicYear: string;
  subject: Subject | undefined;
  gradeLevel: GradeLevel | undefined;
  overview: string;
  entries: Omit<ScopeSequenceEntry, 'id'>[];
}

export interface UnitPlanFormData {
  title: string;
  subject: Subject | undefined;
  gradeLevel: GradeLevel | undefined;
  scopeSequenceId?: string;
  durationWeeks: number;
  startDate?: string;
  endDate?: string;
  bigIdea?: string;
  essentialQuestions: string;
  standards: string[];
  learningObjectives: string;
  assessmentsFormative: string;
  assessmentsSummative: string;
  activities: string;
  materials: string;
  pacingCalendar: string;
  differentiationStrategies?: string;
}

export interface LessonPlanFormData {
  title: string;
  date: string;
  subject: Subject | undefined;
  gradeLevel: GradeLevel | undefined;
  unitPlanId?: string;
  durationMinutes: number;
  objectives: string;
  standards: string;
  procedures: string;
  materials: string;
  differentiation?: string;
  assessmentFormative: string;
  homework?: string;
  notes?: string;
}

// Types pour les props des composants
export interface ScopeAndSequenceFormProps {
  initialData?: ScopeAndSequence;
  onSubmitSuccess?: (data: ScopeAndSequence) => void;
  onCancel?: () => void;
}

export interface UnitPlanFormProps {
  initialData?: UnitPlan;
  scopeSequences?: ScopeAndSequence[];
  onSubmitSuccess?: (data: UnitPlan) => void;
  onCancel?: () => void;
}

export interface LessonPlanFormProps {
  initialData?: LessonPlan;
  unitPlans?: UnitPlan[];
  onSubmitSuccess?: (data: LessonPlan) => void;
  onCancel?: () => void;
}

// Types pour les données d'affichage
export interface ScopeAndSequenceWithUnits extends ScopeAndSequence {
  unitPlans?: UnitPlan[];
}

export interface UnitPlanWithLessons extends UnitPlan {
  lessonPlans?: LessonPlan[];
  scopeSequence?: ScopeAndSequence;
}

export interface LessonPlanWithUnit extends LessonPlan {
  unitPlan?: UnitPlan;
}

// Types pour les filtres et recherches
export interface PlanFilters {
  subject?: Subject;
  gradeLevel?: GradeLevel;
  academicYear?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Types pour les statistiques
export interface PlanningStats {
  totalScopeSequences: number;
  totalUnitPlans: number;
  totalLessonPlans: number;
  upcomingLessons: number;
  recentActivity: {
    type: 'scope' | 'unit' | 'lesson';
    title: string;
    date: Date;
  }[];
}

// Dans types.ts - Ajoutez cette fonction helper
export function convertUnitPlanToFormData(unitPlan?: UnitPlan): UnitPlanFormData {
  if (!unitPlan) {
    return {
      title: "",
      subject: "",
      gradeLevel: "",
      scopeSequenceId: "",
      durationWeeks: 3,
      startDate: "",
      endDate: "",
      bigIdea: "",
      essentialQuestions: "",
      standards: [],
      learningObjectives: "",
      assessmentsFormative: "",
      assessmentsSummative: "",
      activities: "",
      materials: "",
      pacingCalendar: "",
      differentiationStrategies: "",
    };
  }

  return {
    title: unitPlan.title,
    subject: unitPlan.subject_name,
    gradeLevel: unitPlan.grade,
    scopeSequenceId: unitPlan.scope_sequence || "",
    durationWeeks: unitPlan.duration_weeks,
    startDate: unitPlan.start_date || "",
    endDate: unitPlan.end_date || "",
    bigIdea: unitPlan.big_idea || "",
    essentialQuestions: unitPlan.essential_questions,
    standards: unitPlan.standards ? unitPlan.standards.split(', ').filter(s => s.trim()) : [],
    learningObjectives: unitPlan.learning_objectives,
    assessmentsFormative: unitPlan.assessments_formative,
    assessmentsSummative: unitPlan.assessments_summative,
    activities: unitPlan.activities,
    materials: unitPlan.materials,
    pacingCalendar: unitPlan.pacing_calendar,
    differentiationStrategies: unitPlan.differentiation_strategies || "",
  };
}