export interface Assignment {
  id: number;
  name: string;
  teacher: string;
  file: string;
  due_date: string;
  weight: number;
  kind: string;
  class:string;
  day?:string;
  published: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  course: number;
}
