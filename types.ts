export interface UserNavigationInfo {
  label: string;
  basePath: string;
}
export interface MenuRoute {
  path: string;
  icon: React.ReactNode;
  label: string;
}
export interface Assignment {
  id: number;
  name: string;
  file: string;
  due_date: string;
  weight: string;
  kind: string;
  published: boolean;
  course: number;
  created_at: string;
  updated_at: string;
}
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
  last_name: string 
}

export type EducationalCondition = 
  | 'NEAR_TEACHER' 
  | 'EXTRA_SPACE' 
  | 'ATTENTION_DIFFICULTIES'
  | 'VISION_IMPAIRED'
  | 'HEARING_IMPAIRED'
  | 'LEFT_HANDED'
  | 'GROUP_WORK'
  | 'NONE';

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
export interface Character {
  character_id: number;
  student:Student;
  bad_characters: string[];
  good_characters: string[];
  teacher_comment: string;
  create_at: string;
  update_at: string;
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

  export interface  SeatingCondition  {
    id: string;
    type: 'separate' | 'group' | 'front' | 'back' | 'random';
    studentIds: string[];
    priority?: number;
  };


  

  