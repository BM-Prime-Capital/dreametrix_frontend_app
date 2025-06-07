export interface UserInfo {
  id: number;
  email: string;
  username: string;
  phone_number: string | null;
  first_name: string;
  last_name: string;
  date_joined: string;
  is_active: boolean;
}

export interface SchoolInfo {
  name: string;
  email: string;
  phone_number: string | null;
  code: string;
  is_active: boolean;
}

export interface Student {
  id: number; // This is likely the student's ID
  user: UserInfo;
  school: SchoolInfo;
  uuid: string;
  created_at: string;
  updated_at: string;
  grade: number | null; // Based on screenshot, seems nullable
  extra_data: any | null; // Type can be refined if structure is known
  enrolled_courses: number[]; // Array of course IDs
}

export interface StudentApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[]; // Assuming the endpoint returns a list of students
} 