// components/polls/types.ts
export type Choice = {
  id?: number;
  label: string;
  count: number;
  percentage: number;
};

export type Question = {
  id: number;
  text: string;
  type: "single" | "multiple" | "text";
  choices?: Choice[];
  responses?: string[];
  response_count?: number;
};

export type PollBlock = {
  poll_id: number;
  poll_title: string;
  questions: Question[];
};