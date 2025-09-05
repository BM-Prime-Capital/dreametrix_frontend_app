export interface Student {
  id: number;
  user: string;
  school: string;
  uuid: string;
  created_at: string;
  last_update: string;
  grade: number;
  extra_data: Record<string, any>;
  enrolled_courses: number[];
}

export interface Course {
  id: number;
  name: string;
  subject: {
    full: string;
    short: string;
  };
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  status: AttendanceStatus;
  course: Course;
  teacher: Teacher;
}

export interface AttendanceStatistics {
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
}

export interface AttendanceSummary {
  total_days: number;
  present: number;
  absent: number;
  late: number;
  half_day: number;
  attendance_rate: number;
}

export interface AttendanceResponse {
  student_id: number;
  full_name: string;
  attendances: AttendanceRecord[];
  statistics: AttendanceStatistics;
  summary: AttendanceSummary;
  // Pagination fields (may be present in some API responses)
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
  EXCUSED = "excused"
}

export interface AttendanceQueryParams {
  limit?: number;
  offset?: number;
  date?: string;
  status?: AttendanceStatus;
}