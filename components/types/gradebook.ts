export interface ClassType {
  id: string;
  name: string;
  average: number; // Toujours un nombre pour les calculs
  noOfExams: number;
  noOfTests: number;
  noOfHomeworks: number;
  noOfParticipation: number;
  noOfOther: number;
}

export interface StudentGrade {
  id: string;
  name: string;
  average: number;
  examGeneral: number;
  examPractical: number;
  quizGeneral: number;
  quizPop: number;
  quizUnit1: number;
  quizUnit2: number;
  homeWorkChapter: number;
  homeWorkGeneral: number;
  homeWorkProject: number;
}

export interface ClassData {
  id: string;
  name: string;
  average: string;
  noOfExams: number;
  noOfTests: number;
  noOfHomeworks: number;
  noOfParticipation: number;
  noOfOther: number;
  totalWork: number;
  assessments?: {
    assessment_type: string;
    name: string;
    weight: string;
  }[];
}
