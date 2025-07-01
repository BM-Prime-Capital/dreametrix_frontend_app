// polls/api.ts

export type PollChoice = {
  id: number;
  label: string;
  count: number;
  percentage: number;
};

export type QuestionResult = {
  id: number;
  text: string;
  type: string;
  choices?: PollChoice[];
  responses?: string[];
  response_count?: number;
};


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
    if (response.status === 401) throw new Error("Session expirée. Veuillez vous reconnecter.");
    if (response.status === 403) throw new Error("Accès refusé.");
    throw new Error("Erreur lors de l'appel API.");
  }

  return await response.json();
}

export const getPolls = async (
  domain: string,
  token: string
): Promise<any> => {
  return await fetchWithAuth(`${domain}/polls/polls/`, token);
};


// api/polls.ts

export async function createPoll(
  pollData: {
    title: string;
    description: string;
    course: number;
    deadline: string;
    is_anonymous: boolean;
    questions: any[];
  },
  tenantPrimaryDomain: string,
  accessToken: string
): Promise<any> {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${tenantPrimaryDomain}/polls/polls/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(pollData),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission de créer un sondage.");
    } else {
      throw new Error("Erreur lors de la création du sondage.");
    }
  }

  return await response.json();
}


export const submitPoll = async (
  domain: string,
  token: string,
  pollId: number,
  answers: any
): Promise<any> => {
  return await fetchWithAuth(`${domain}/polls/polls/${pollId}/submit/`, token, 'POST', { answers });
};

export async function fetchPollResults(
  domain: string,
  token: string,
  pollId: number
): Promise<QuestionResult[]> {
  const url = `${domain}/polls/polls/${pollId}/results/`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    } else if (response.status === 403) {
      throw new Error("You do not have permission to access poll results.");
    } else {
      throw new Error("Error while fetching poll results.");
    }
  }

  return await response.json();
}


export async function getRespondents(pollId: number, domain: string, token: string) {
  const response = await fetch(`${domain}/polls/polls/${pollId}/respondents/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function getNonRespondents(pollId: number, domain: string, token: string) {
  const response = await fetch(`${domain}/polls/polls/${pollId}/non-respondents/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}



import type { PollBlock, Question, Choice } from "./types";


export const getGlobalResults = async (
  domain: string,
  token: string,
  courseId: number,
  submitted_after?: string,
  submitted_before?: string
): Promise<PollBlock[]> => {
  const params = new URLSearchParams({ course_id: courseId.toString() });
  if (submitted_after) params.append('submitted_after', submitted_after);
  if (submitted_before) params.append('submitted_before', submitted_before);
  
  try {
    const response = await fetch(`${domain}/polls/polls/global_results/?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate and transform the API response
    return data.map((poll: any): PollBlock => ({
      poll_id: poll.poll_id,
      poll_title: poll.poll_title,
      questions: poll.questions.map((question: any): Question => ({
        id: question.id,
        text: question.text,
        type: question.type === "single" || question.type === "multiple" || question.type === "text" 
          ? question.type 
          : "text",
        choices: question.choices?.map((choice: any): Choice => ({
          id: choice.id,
          label: choice.label,
          count: choice.count,
          percentage: choice.percentage
        })),
        responses: question.responses,
        response_count: question.response_count
      }))
    }));
  } catch (error) {
    console.error('Error fetching global results:', error);
    throw error;
  }
};