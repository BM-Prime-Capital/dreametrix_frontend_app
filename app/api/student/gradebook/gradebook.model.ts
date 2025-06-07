export interface StudentGrade {
  student_name: string;
  student_id: number;
  average_grade: number;
  assessment_types: {
    test: any[]; // Define a more specific interface if needed
    homework: any[]; // Define a more specific interface if needed
    quiz: any[]; // Define a more specific interface if needed
    participation: any[]; // Define a more specific interface if needed
    other: any[]; // Define a more specific interface if needed
  };
}