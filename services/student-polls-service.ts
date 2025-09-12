import { StudentPoll, PollResponse, NonRespondent, PollSubmission } from "@/types/student-polls";

export interface StudentPollsService {
  getAvailablePolls(tenantDomain: string, accessToken: string): Promise<StudentPoll[]>;
  getPollDetails(pollId: number, tenantDomain: string, accessToken: string): Promise<StudentPoll>;
  submitPollResponse(pollId: number, responses: PollResponse[], tenantDomain: string, accessToken: string): Promise<any>;
  getNonRespondents(pollId: number, tenantDomain: string, accessToken: string): Promise<NonRespondent[]>;
}

async function fetchWithAuth(url: string, accessToken: string, method: string = 'GET', body?: any) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    if (response.status === 403) {
      throw new Error("Access denied.");
    }
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}

export async function getAvailablePolls(
  tenantDomain: string,
  accessToken: string
): Promise<StudentPoll[]> {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantDomain}/polls/polls/`;
  const data = await fetchWithAuth(url, accessToken);
  
  // Filter only polls that are available for students to respond to
  return data.results || data;
}

export async function getPollDetails(
  pollId: number,
  tenantDomain: string,
  accessToken: string
): Promise<StudentPoll> {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantDomain}/polls/polls/${pollId}/`;
  return await fetchWithAuth(url, accessToken);
}

export async function submitPollResponse(
  pollId: number,
  responses: PollResponse[],
  tenantDomain: string,
  accessToken: string
): Promise<any> {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantDomain}/polls/polls/${pollId}/submit/`;
  const submissionData: PollSubmission = {
    answers: responses
  };

  return await fetchWithAuth(url, accessToken, 'POST', submissionData);
}

export async function getNonRespondents(
  pollId: number,
  tenantDomain: string,
  accessToken: string
): Promise<NonRespondent[]> {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantDomain}/polls/polls/${pollId}/non_respondents/`;
  const data = await fetchWithAuth(url, accessToken);
  
  return data.results || data;
}

export async function checkPollSubmissionStatus(
  pollId: number,
  tenantDomain: string,
  accessToken: string
): Promise<{ has_responded: boolean; submitted_at?: string }> {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  try {
    const url = `${tenantDomain}/polls/polls/${pollId}/status/`;
    return await fetchWithAuth(url, accessToken);
  } catch (error) {
    // If endpoint doesn't exist, assume not submitted
    return { has_responded: false };
  }
}