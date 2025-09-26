export interface CourseWrite {
    name: string;
    subject_in_all_letter?: string;
    subject_in_short?: string;
    hours_and_dates_of_course_schedule?: string;
    description?: string;
    grade?: string;
    teacher: number;
    students: number[];
  }
  
  export interface Teacher {
    id: number;
    full_name: string;
  }

  export interface Student {
    id: number;
    full_name: string;
  }
  
  export interface CourseRead {
    id: number;
    name: string;
    subject_in_all_letter?: string;
    subject_in_short?: string;
    hours_and_dates_of_course_schedule?: { [day: string]: any };
    description?: string;
    grade?: string;
    created_at?: string;
    updated_at?: string;
    teacher?: Teacher;
    students?: Student[];
  }