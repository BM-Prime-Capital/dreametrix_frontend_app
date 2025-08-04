import { useState, useEffect, useCallback } from 'react';
import { 
  getParentChildren, 
  getAvailableSubjects, 
  getAvailableLevels,
  ParentChild,
  Subject,
  Level
} from '@/services/ParentFilterService';

interface UseParentFiltersProps {
  accessToken: string;
  refreshToken: string;
}

interface UseParentFiltersReturn {
  children: ParentChild[];
  subjects: Subject[];
  levels: Level[];
  loading: boolean;
  error: string | null;
  refreshFilters: () => void;
}

export function useParentFilters({
  accessToken,
  refreshToken
}: UseParentFiltersProps): UseParentFiltersReturn {
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilters = useCallback(async () => {
    if (!accessToken) {
      setError("Missing access token");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all filter data in parallel
      const [childrenData, subjectsData, levelsData] = await Promise.all([
        getParentChildren(accessToken, refreshToken),
        getAvailableSubjects(accessToken, refreshToken),
        getAvailableLevels(accessToken, refreshToken)
      ]);

      setChildren(childrenData);
      setSubjects(subjectsData);
      setLevels(levelsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error retrieving filter data";
      setError(errorMessage);
      console.error("Error useParentFilters:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshToken]);

  const refreshFilters = useCallback(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  return {
    children,
    subjects,
    levels,
    loading,
    error,
    refreshFilters
  };
} 