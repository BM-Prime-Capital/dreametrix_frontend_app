import { title } from "node:process";
export interface UserNavigationInfo {
  label: string;
  basePath: string;
}

export interface MenuRoute {
  path: string;
  icon: any;
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
  // Ajouter d'autres propriétés si nécessaire
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

type DaySchedule = {
  date: string;
  start_time: string;
  end_time: string;
};
interface SchoolClassSchedule {
  Monday: DaySchedule[];
  Wednesday: DaySchedule[];
  Friday: DaySchedule[];
}
export interface ISchoolClass {
  id?: string;
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

export interface Character {
  character_id: number;
  student: { id: number; first_name: string; last_name: string };
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
  // autres propriétés utilisateur...
}



  export interface ITeacher {
    id: number;
    full_name?: string;
    user: IUser;
    // autres propriétés teacher...
  }
  
  export interface IStudent {
    id: number;
    first_name?: string;
    last_name?: string;
    user: IUser;
    grade?: string;
    // autres propriétés student...
  }