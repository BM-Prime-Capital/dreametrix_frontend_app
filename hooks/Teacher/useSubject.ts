import { useState, useEffect } from 'react';
import { useRequestInfo } from '../useRequestInfo'

interface SubjectsResponse {
  subjects: string[];
}

export default function useSubjects() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tenantDomain, accessToken } = useRequestInfo();

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!tenantDomain) return;
      
      try {
        const response = await fetch(`${tenantDomain}/testprep/subjects/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }

        const data: SubjectsResponse = await response.json();
        setSubjects(data.subjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [tenantDomain, accessToken]);

  return { subjects, isLoading, error };
}