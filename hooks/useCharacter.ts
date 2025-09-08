import { useState, useEffect, useCallback } from 'react';
import { CharacterResponse, CharacterQueryParams, CharacterRating, CharacterSummary } from '@/types/character';
import { CharacterService, CharacterApiError } from '@/services/character.service';

interface UseCharacterState {
  data: CharacterRating[];
  loading: boolean;
  error: string | null;
  studentInfo: { id: number; name: string } | null;
  summary: CharacterSummary | null;
}

interface UseCharacterReturn extends UseCharacterState {
  refetch: () => Promise<void>;
  fetchByDate: (date: string) => Promise<void>;
  fetchByPeriod: (period: string) => Promise<void>;
  clearError: () => void;
}


export function useCharacter(
  initialParams: CharacterQueryParams = {},
  accessToken?: string
): UseCharacterReturn {
  const [state, setState] = useState<UseCharacterState>({
    data: [],
    loading: true,
    error: null,
    studentInfo: null,
    summary: null,
  });

  const [params, setParams] = useState<CharacterQueryParams>({
    ...initialParams,
  });

  const fetchCharacterRatings = useCallback(async (queryParams: CharacterQueryParams, token?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    // Validate token before making API call
    if (!token || token.trim() === '') {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Authentication required. Please log in again.',
        data: [],
      }));
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Character accessToken => ", token);
    }
    try {
      const response: CharacterResponse = await CharacterService.getStudentCharacterRatings(queryParams, token);
      
      setState({
        data: response.ratings || [],
        loading: false,
        error: null,
        studentInfo: {
          id: response.student_id,
          name: response.full_name
        },
        summary: response.summary,
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch character data';
      
      if (error instanceof CharacterApiError) {
        errorMessage = error.message;
        // Handle specific authentication errors
        if (error.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. You do not have permission to view this data.';
        }
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        data: [],
      }));
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchCharacterRatings(params, accessToken);
  }, [fetchCharacterRatings, params, accessToken]);


  const fetchByDate = useCallback(async (date: string) => {
    const newParams = { ...params, date };
    setParams(newParams);
    await fetchCharacterRatings(newParams, accessToken);
  }, [fetchCharacterRatings, params, accessToken]);

  const fetchByPeriod = useCallback(async (period: string) => {
    const newParams = { ...params, period };
    setParams(newParams);
    await fetchCharacterRatings(newParams, accessToken);
  }, [fetchCharacterRatings, params, accessToken]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    // Only fetch if we have an accessToken
    if (accessToken && accessToken.trim() !== '') {
      fetchCharacterRatings(params, accessToken);
    } else {
      // Set loading to false if no token available
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [fetchCharacterRatings, params, accessToken]);

  // Debug logging in development only
  if (process.env.NODE_ENV === 'development') {
    console.log("useCharacter state:", { 
      hasData: !!state.data, 
      dataLength: state.data?.length, 
      loading: state.loading, 
      error: state.error,
      hasToken: !!accessToken 
    });
  }

  return {
    ...state,
    refetch,
    fetchByDate,
    fetchByPeriod,
    clearError,
  };
}