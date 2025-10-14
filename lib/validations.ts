import { z } from "zod";

export const subjectSchema = z.enum(['ELA', 'Math', 'Science']);
export type Subject = z.infer<typeof subjectSchema>;

export const gradeLevelSchema = z.enum([
  "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade",
  "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", 
  "10th Grade", "11th Grade", "12th Grade"
]);
export type GradeLevel = z.infer<typeof gradeLevelSchema>;

// Schéma pour Scope & Sequence Entry
export const scopeSequenceEntrySchema = z.object({
  id: z.string().optional(),
  month: z.string().min(1, "Month is required"),
  topic: z.string().min(1, "Topic is required"),
  standardCode: z.string().min(1, "Standard code is required"),
  learningObjective: z.string().min(1, "Learning objective is required"),
  essentialQuestions: z.string().optional(),
  vocabulary: z.string().optional(),
  resources: z.string().optional(),
  formativeAssessments: z.string().optional(),
  summativeAssessments: z.string().optional(),
  durationWeeks: z.number().min(1).max(12, "Duration must be between 1-12 weeks"),
});

// Schéma pour Scope & Sequence
export const scopeAndSequenceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, "Format must be YYYY-YYYY (e.g., 2024-2025)"),
  subject: subjectSchema,
  gradeLevel: gradeLevelSchema,
  overview: z.string().min(10, "Overview must be at least 10 characters"),
  entries: z.array(scopeSequenceEntrySchema).min(1, "At least one entry is required"),
});

// Schéma pour Unit Plan
export const unitPlanSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: subjectSchema,
  gradeLevel: gradeLevelSchema,
  scopeSequenceId: z.string().optional(),
  durationWeeks: z.number().min(1).max(52),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bigIdea: z.string().optional(),
  essentialQuestions: z.string().min(1, "Essential questions are required"),
  standards: z.string().min(1, "Standards are required"),
  learningObjectives: z.string().min(1, "Learning objectives are required"),
  assessmentsFormative: z.string().optional(),
  assessmentsSummative: z.string().optional(),
  activities: z.string().min(1, "Activities are required"),
  materials: z.string().min(1, "Materials are required"),
  pacingCalendar: z.string().optional(),
  differentiationStrategies: z.string().optional(),
});

// Schéma pour Lesson Plan
export const lessonPlanSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  subject: subjectSchema,
  gradeLevel: gradeLevelSchema,
  unitPlanId: z.string().optional(),
  durationMinutes: z.number().min(5).max(480, "Duration must be between 5-480 minutes"),
  objectives: z.string().min(1, "Objectives are required"),
  standards: z.string().min(1, "Standards are required"),
  procedures: z.string().min(1, "Procedures are required"),
  materials: z.string().min(1, "Materials are required"),
  differentiation: z.string().optional(),
  assessmentFormative: z.string().min(1, "Formative assessment is required"),
  homework: z.string().optional(),
  notes: z.string().optional(),
});



// Types dérivés des schémas
export type ScopeAndSequenceFormValues = z.infer<typeof scopeAndSequenceSchema>;
export type UnitPlanFormValues = z.infer<typeof unitPlanSchema>;
export type LessonPlanFormValues = z.infer<typeof lessonPlanSchema>;
export type ScopeSequenceEntryFormValues = z.infer<typeof scopeSequenceEntrySchema>;