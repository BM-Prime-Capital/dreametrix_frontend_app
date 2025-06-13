export interface ScopeSequence {
  id: string;
  title: string;
  academicYear: string;
  subjects: Subject[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface Subject {
  id: string;
  name: string;
  grades: Grade[];
}

export interface Grade {
  id: string;
  name: string;
  units: UnitRef[];
}

export interface UnitRef {
  id: string;
  name: string;
  duration: string;
}

export interface UnitPlan {
  id: string;
  scopeSequenceId: string;
  title: string;
  durationWeeks: number;
  objectives: string[];
  standards: string[];
  resources: string[];
  assessments: string[];
  lessons: LessonRef[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface LessonRef {
  id: string;
  title: string;
  date: Date;
}

export interface LessonPlan {
  id: string;
  unitPlanId: string;
  title: string;
  date: Date;
  objectives: string[];
  standards: string[];
  activities: LessonActivity[];
  materials: string[];
  assessment: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface LessonActivity {
  type: 'warmup' | 'instruction' | 'practice' | 'assessment' | 'other';
  durationMinutes: number;
  description: string;
  resources?: string[];
}