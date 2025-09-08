export interface AttendanceBalance {
  present: number;
  absent: number;
  late: number;
  half_day: number;
}

export interface GoodCharacter {
  decorum: number;
  grit: number;
  optimism: number;
  engagement: number;
  gratitude: number;
}

export interface BadCharacter {
  integrity: number;
  optimism: number;
}

export interface FollowUp {
  edit: boolean;
  delete: boolean;
}

export interface LatestNews {
  date: string;
  period: string;
  class: string;
  status: "good" | "bad";
  newsAndComment: string;
  sanctions: string;
  created_at: string;
  points: number;
  followUp: FollowUp;
}

export interface RewardStudent {
  name: string;
  totalPoints: number;
  goodDomains: string[];
  focusDomains: string[];
  attendanceBalance: AttendanceBalance;
  goodCharacter: GoodCharacter;
  badCharacter: BadCharacter;
  latestNews: LatestNews[];
}

export interface RewardsResponse {
  student: RewardStudent;
}

export interface RewardsQueryParams {
  date?: string;
  period?: string;
  class_info?: number;
}

export interface RewardsStats {
  totalGoodPoints: number;
  totalBadPoints: number;
  netScore: number;
  attendanceRate: number;
  topDomain: string;
  focusArea: string;
}