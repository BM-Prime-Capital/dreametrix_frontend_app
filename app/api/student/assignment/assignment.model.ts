export interface Course {
  id: number;
  name: string;
}

export interface Submission {
  student: number | null;
  course: number | null;
  assessment: number | null;
  file: string | null;
  grade: number | null;
  marked: boolean;
  voice_notes: string | null;
}

export interface Assignment {
  id: number;
  name: string;
  file: string;
  due_date: string;
  weight: string;
  kind: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  course: Course;
  submission?: Submission; // Make submission optional
}

export interface AssignmentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Assignment[];
}
