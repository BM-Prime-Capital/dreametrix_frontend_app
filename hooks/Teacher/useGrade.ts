import { useState, useEffect } from 'react';
import { useRequestInfo } from '../useRequestInfo'

interface GradesResponse {
  grades: number[];
}

export default function useGrades(subject: string) {
  const [grades, setGrades] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tenantDomain, accessToken } = useRequestInfo();

  useEffect(() => {
    const fetchGrades = async () => {
      if (!tenantDomain || !subject) return;
      
      try {
        const response = await fetch(`${tenantDomain}/testprep/grades/${subject}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch grades');
        }

        const data: GradesResponse = await response.json();
        setGrades(data.grades);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, [tenantDomain, subject, accessToken]);

  return { grades, isLoading, error };
}