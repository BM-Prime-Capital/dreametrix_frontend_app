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

export interface GradebookSheet {
  subject: string;
  grade: string;
  domain: string;
  specificStandards: string[];
  questionType: string;
  studentsClass: string[];
}

export interface SheetDomain {
  subject: string;
  grade: string;
  name: string;
  specificStandards: string[];
}



