export interface StudentPoll {
  id: number;
  title: string;
  description: string;
  deadline: string;
  course: number;
  course_name?: string;
  is_anonymous: boolean;
  questions: StudentPollQuestion[];
  has_responded?: boolean;
  submitted_at?: string;
  is_expired?: boolean;
}

export interface StudentPollQuestion {
  id: number;
  text: string;
  question_type: "single" | "multiple" | "text";
  required: boolean;
  choices?: PollChoice[];
}

export interface PollChoice {
  id: number;
  label: string;
}

export interface PollResponse {
  question: number;
  selected_choices?: number[];
  text_response?: string;
}

export interface PollSubmission {
  answers: PollResponse[];
}

export interface NonRespondent {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  full_name?: string;
}

export interface StudentPollStatus {
  poll_id: number;
  has_responded: boolean;
  submitted_at?: string;
  can_resubmit?: boolean;
}

export interface PollTableFilters {
  status: "all" | "pending" | "submitted" | "expired";
  course: string;
  search: string;
}

export type PollFormData = Record<number, any>;