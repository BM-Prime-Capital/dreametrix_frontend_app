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

export interface ClassDay {
  id: number;
  day: string;
  hour: string;
  munite: string;
  dayPart: string;
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
