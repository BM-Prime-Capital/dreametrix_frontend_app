import { useState, useEffect } from 'react';
import { useRequestInfo } from '../useRequestInfo';

interface DomainsResponse {
  domains: string[];
}

export default function useDomains(subject: string, grade: number) {
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tenantDomain, accessToken } = useRequestInfo();

  useEffect(() => {
    const fetchDomains = async () => {
      if (!tenantDomain || !subject || !grade) return;
      
      try {
        const response = await fetch(`${tenantDomain}/digital_library/domains/${subject}/${grade}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch domains');
        }

        const data: DomainsResponse = await response.json();
        setDomains(data.domains);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDomains();
  }, [tenantDomain, subject, grade, accessToken]);

  return { domains, isLoading, error };
}