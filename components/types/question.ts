export interface Question {
    id: number;
    type: string;
    links: string[];
    main_link: string;
    standard: string;
    difficulty: string;
    page_count: number;
    preview_urls: string[];
    // Add the missing properties here
    questionNumber: number;
    correctAnswer: string;
    pointValue: number;
  }