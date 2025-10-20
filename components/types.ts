// types.ts
export interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    // autres propriétés utilisateur...
  }
  

  
  export interface ISchoolClass {
    id: number;
    name: string;
    subject_in_all_letter: string;
    subject_in_short: string;
    hours_and_dates_of_course_schedule: Record<string, any>;
    description: string;
    grade: string;
    teacher: ITeacher | number; // Peut être un objet Teacher ou juste l'ID
    students: number[] | { id: number; full_name: string }[]; // Can be array of IDs or student objects
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