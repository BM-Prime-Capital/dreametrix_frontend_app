import { useState, useEffect, useCallback } from 'react';
import { getParentClasses, getParentClassDetails, getParentClassesByChild, ParentClass, ParentClassDetails } from '@/services/ParentClassService';

interface UseParentClassesProps {
  accessToken: string;
  refreshToken: string;
  childId?: number;
}

interface UseParentClassesReturn {
  classes: ParentClass[];
  loading: boolean;
  error: string | null;
  refreshClasses: () => void;
}

export function useParentClasses({
  accessToken,
  refreshToken,
  childId
}: UseParentClassesProps): UseParentClassesReturn {
  const [classes, setClasses] = useState<ParentClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    if (!accessToken) {
      setError("Token d'accès manquant");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let fetchedClasses: ParentClass[];

      if (childId) {
        // Si un enfant spécifique est sélectionné, récupérer ses classes
        fetchedClasses = await getParentClassesByChild(childId, accessToken);
      } else {
        // Sinon, récupérer toutes les classes
        fetchedClasses = await getParentClasses(accessToken);
      }

      setClasses(fetchedClasses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des classes";
      setError(errorMessage);
      console.error("Erreur useParentClasses:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshToken, childId]);

  const refreshClasses = useCallback(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    loading,
    error,
    refreshClasses
  };
}

interface UseParentClassDetailsProps {
  classId: number;
  accessToken: string;
  refreshToken: string;
}

interface UseParentClassDetailsReturn {
  classDetails: ParentClassDetails | null;
  loading: boolean;
  error: string | null;
  refreshDetails: () => void;
}

export function useParentClassDetails({
  classId,
  accessToken,
  refreshToken
}: UseParentClassDetailsProps): UseParentClassDetailsReturn {
  const [classDetails, setClassDetails] = useState<ParentClassDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassDetails = useCallback(async () => {
    if (!accessToken || !classId) {
      setError("Token d'accès ou ID de classe manquant");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const details = await getParentClassDetails(classId, accessToken);
      setClassDetails(details);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la récupération des détails de la classe";
      setError(errorMessage);
      console.error("Erreur useParentClassDetails:", err);
    } finally {
      setLoading(false);
    }
  }, [classId, accessToken, refreshToken]);

  const refreshDetails = useCallback(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  return {
    classDetails,
    loading,
    error,
    refreshDetails
  };
} 