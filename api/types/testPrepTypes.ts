  export interface PdfData {
    answers: CorrectedAnswer[];
    testDetails: {
      subject: string;
      grade: string;
      domain: string;
    };
  }


  export interface Answer {
    questionId: number;
    selectedOption: string | null;
    correctAnswer?: string;
    isCorrect?: boolean;
  }
  

  
  export interface TestDetails {
    subject: string;
    grade: string;
    domain: string;
  }





  export interface ExcelAnswer {
    questionId: number;
    answer: string;
  }
  
  export interface UserAnswer {
    questionId: number;
    selectedOption: string | null;
  }
  
  // export interface CorrectedAnswer extends UserAnswer {
  //   correctAnswer: string;
  //   isCorrect: boolean;
  //   pointsEarned: number;
  // }

  export interface CorrectedAnswer extends UserAnswer {
    correctAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    domain?: string; // Add this optional property
    questionNumber?: number; // Add if needed
  }
  
  export interface CorrectionResult {
    correctedAnswers: CorrectedAnswer[];
    score: number;
    totalPossible: number;
    percentage: number;
  }
