import { useState, useEffect, useCallback } from 'react';
import { RewardsResponse, RewardsQueryParams, RewardStudent } from '@/types/rewards';
import { RewardsService, RewardsApiError } from '@/services/rewards.service';

interface UseRewardsState {
  data: RewardStudent | null;
  loading: boolean;
  error: string | null;
}

interface UseRewardsReturn extends UseRewardsState {
  refetch: () => Promise<void>;
  fetchByDate: (date: string) => Promise<void>;
  fetchByPeriod: (period: string) => Promise<void>;
  clearError: () => void;
}

export function useRewards(
  initialParams: RewardsQueryParams = {},
  accessToken?: string
): UseRewardsReturn {
  const [state, setState] = useState<UseRewardsState>({
    data: null,
    loading: true,
    error: null,
  });

  const [params, setParams] = useState<RewardsQueryParams>({
    ...initialParams,
  });

  const fetchStudentRewards = useCallback(async (queryParams: RewardsQueryParams, token?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    // Validate token before making API call
    if (!token || token.trim() === '') {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Authentication required. Please log in again.',
        data: null,
      }));
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Rewards accessToken => ", token);
    }
    try {
      const response: RewardsResponse = await RewardsService.getStudentRewards(queryParams, token);
      
      setState({
        data: response.student,
        loading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch rewards data';
      
      if (error instanceof RewardsApiError) {
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
        data: null,
      }));
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchStudentRewards(params, accessToken);
  }, [fetchStudentRewards, params, accessToken]);

  const fetchByDate = useCallback(async (date: string) => {
    const newParams = { ...params, date };
    setParams(newParams);
    await fetchStudentRewards(newParams, accessToken);
  }, [fetchStudentRewards, params, accessToken]);

  const fetchByPeriod = useCallback(async (period: string) => {
    const newParams = { ...params, period };
    setParams(newParams);
    await fetchStudentRewards(newParams, accessToken);
  }, [fetchStudentRewards, params, accessToken]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    // Only fetch if we have an accessToken
    if (accessToken && accessToken.trim() !== '') {
      fetchStudentRewards(params, accessToken);
    } else {
      // Set loading to false if no token available
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [fetchStudentRewards, params, accessToken]);

  // Debug logging in development only
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("useRewards state:", { 
        hasData: !!state.data, 
        studentName: state.data?.name, 
        loading: state.loading, 
        error: state.error,
        hasToken: !!accessToken 
      });
    }
  }, [state.data, state.loading, state.error, accessToken]);

  return {
    ...state,
    refetch,
    fetchByDate,
    fetchByPeriod,
    clearError,
  };
}