import { useState, useEffect } from 'react';
import { useRequestInfo } from '../useRequestInfo';

interface Question {
  id: number;
  type: string;
  links: string[];
  main_link: string;
  standard: string;
  difficulty: string;
  page_count: number;
  preview_urls: string[];
}

interface QuestionsResponse {
  questions: Question[];
  count: number;
  mc_count: number;
  or_count: number;
}

export default function useQuestions(subject: string, grade: number, domain: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tenantDomain, accessToken } = useRequestInfo();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!tenantDomain || !subject || !grade || !domain) return;
      
      try {
        const response = await fetch(`${tenantDomain}/testprep/questions/${subject}/${grade}/${encodeURIComponent(domain)}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data: QuestionsResponse = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [tenantDomain, subject, grade, domain, accessToken]);

  return { questions, isLoading, error };
}