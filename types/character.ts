/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CharacterClass {
  id: number;
  name: string;
  subject: string;
}

export interface CharacterTeacher {
  id: number;
  full_name: string;
  email: string;
}

export interface CharacterRating {
  character_id:string;
  class_info: any;
  id: number;
  date: string;
  class: CharacterClass;
  teacher: CharacterTeacher;
  good_statistics_character: string[];
  bad_statistics_character: string[];
  sanctions: string;
  period: string;
  teacher_comment_good_character: string;
  teacher_comment_bad_character: string;
}

export interface CharacterSummary {
  total_days_evaluated: number;
  total_good_character: number;
  total_bad_character: number;
  average_good_per_day: number;
  average_bad_per_day: number;
}

export interface CharacterResponse {
  student_id: number;
  full_name: string;
  ratings: CharacterRating[];
  summary: CharacterSummary;
}

export interface CharacterQueryParams {
  limit?: number;
  offset?: number;
  date?: string;
  period?: string;
  class_info?: number;
}

export interface CharacterStats {
  totalGoodBehaviors: number;
  totalBadBehaviors: number;
  overallScore: number;
  percentageGood: number;
}

export interface CharacterComment {
  id: number;
  type: "good" | "bad";
  text: string;
  date: string;
  period: string;
}

export interface CharacterDisplayData {
  character_id: number;
  className: string;
  date: string;
  period: string;
  goodBehaviors: string[];
  badBehaviors: string[];
  goodComment: string;
  badComment: string;
  sanctions: string;
  stats: CharacterStats;
}