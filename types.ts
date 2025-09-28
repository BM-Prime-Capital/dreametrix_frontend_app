import React from "react";

export interface UserNavigationInfo {
  label: string;
  basePath: string;
}
export interface MenuRoute {
  path: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}
export interface MiniCourse {
  id: number;
  name: string;
}
export interface Assignment {
  id: number;
  name: string;
  file: string;
  due_date: string;
  weight: string;
  kind: string;
  published: boolean;
  course: MiniCourse;
  created_at: string;
  updated_at: string;
  submissions_count?: number;
  average_grade?: number;
}

export interface School {
  id: string; 
  name: string; 
  shortName: string; 
  district: string; 
  address: string; 
  city: string; 
  postalCode: string; 
  country: string; 
  phone: string; 
  email: string; 
  website?: string; 
  principal: string; 
  vicePrincipal?: string; 
  description?: string; 
  studentCount: number; 
  teacherCount: number; 
  courseCount: number; 
  establishmentDate: string; 
  isActive: boolean; 
  hasInternetAccess: boolean; 
  internetSpeed?: string; 
  facilities?: string[]; 
  additionalInfo?: string; 
  status: 'active' | 'pending' | 'inactive';
  lastUpdated: string; 
  createdAt: string; 
  updatedAt: string; 
}

export type District = {
  id: string;
  name: string;
  code: string;
  region: string;
  superintendent: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  website?: string;
  description?: string;
  schoolsCount: number;
  studentsCount: number;
  staffCount: number;
  status: "active" | "inactive";
  establishedDate: string;
  lastUpdated: string;
};

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  schoolId?: string;
  districtId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>;

export type DistrictFormData = Omit<District, "id" | "lastUpdated">;

export interface ClassDay {
  id: number;
  day: string;
  hour: string;
  munite: string;
  dayPart: string;
}
export interface Class {
  id: number;
  name: string;
  subject_in_all_letter: string;
  subject_in_short: string;
  hours_and_dates_of_course_schedule: Record<
    string,
    { start_time: string; end_time: string }
  >;
  description: string;
  grade: string;
  teacher: number | { id: number; full_name: string };
  students: number[];
}

export interface ISchoolClass {
  id?: number;
  name: string;
  subject_in_all_letter: string;
  subject_in_short: string;
  hours_and_dates_of_course_schedule: Record<
    string,
    { start_time: string; end_time: string }
  >;
  description: string;
  grade: string;
  teacher: number;
  students: number[];
}

type FileRecord = {
  name: string;
  url: string;
};

export interface Communication {
  userImageUrl: string;
  userName: string;
  message: string;
  created: string;
  attachedFilesUrls: FileRecord[];
}

export interface SchoolClasses {
  subject: string;
  grade: string;
  name: string;
  teacher: string;
}
export interface DigitalLibrarySheet {
  subject: string;
  grade: string;
  domain: string;
  questionType: string;
  studentsClass: string[];
  noOfQuestions: string;
  generateAnswerSheet: boolean;
  includeAnswerKey: boolean;
  assignmentType: string;
}
export interface SheetDomain {
  subject: string;
  grade: string;
  name: string;
  specificStandards: string[];
}
export interface Student {
  id: number;
  first_name: string;
  last_name: string;
}

export type EducationalCondition =
  | "NEAR_TEACHER"
  | "EXTRA_SPACE"
  | "ATTENTION_DIFFICULTIES"
  | "VISION_IMPAIRED"
  | "HEARING_IMPAIRED"
  | "LEFT_HANDED"
  | "GROUP_WORK"
  | "NONE";

export type StudentCondition = {
  studentId: string;
  condition: EducationalCondition;
  pairedStudentId?: string;
  separatedStudentId?: string;
};

export type ClassroomSeat = {
  row: number;
  column: number;
  isNearTeacher: boolean;
  isFrontRow: boolean;
  hasExtraSpace: boolean;
  isQuietArea: boolean;
};

export interface SeatingCondition {
  studentId: string;
  condition: string;
}
export interface CharacterObservationEntry {
  id: string;
  trait: string;
  timestamp: string;
  comment?: string;
}

export interface Character {
  character_id: number;
  student: Student;
  bad_characters: string[];
  good_characters: string[];
  teacher_comment: string;
  create_at: string;
  update_at: string;
  observation_date?: string;
}

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
}
export interface ITeacher {
  id: number;
  full_name?: string;
  user: IUser;
}
export interface IStudent {
  id: number;
  first_name?: string;
  last_name?: string;
  user: IUser;
  grade?: string;
}

export interface SeatingCondition {
  id: string;
  type: "separate" | "group" | "front" | "back" | "random";
  studentIds: string[];
  priority?: number;
}

export type CreateSchool = Omit<School, 
  'id' | 'status' | 'lastUpdated' | 'createdAt' | 'updatedAt'
>;

export type UpdateSchool = Partial<CreateSchool> & {
  id: string;
};

export type SchoolFilters = {
  search?: string;
  district?: string;
  status?: 'active' | 'pending' | 'inactive';
  hasInternet?: boolean;
  minStudents?: number;
  maxStudents?: number;
};