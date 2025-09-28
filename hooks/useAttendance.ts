import { useState, useEffect, useCallback } from 'react';
import { AttendanceResponse, AttendanceQueryParams, AttendanceRecord } from '@/types/attendance';
import { AttendanceService, AttendanceApiError } from '@/services/attendance.service';

interface UseAttendanceState {
  data: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
}

interface UseAttendanceReturn extends UseAttendanceState {
  refetch: () => Promise<void>;
  fetchPage: (page: number) => Promise<void>;
  fetchByDate: (date: string) => Promise<void>;
  clearError: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

export function useAttendance(
  initialParams: AttendanceQueryParams = {},
  accessToken?: string
): UseAttendanceReturn {
  const [state, setState] = useState<UseAttendanceState>({
    data: [],
    loading: true,
    error: null,
    totalCount: 0,
    hasNext: false,
    hasPrevious: false,
    currentPage: 1,
  });

  const [params, setParams] = useState<AttendanceQueryParams>({
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
    ...initialParams,
  });

  const fetchAttendance = useCallback(async (queryParams: AttendanceQueryParams, token?: string) => {
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
    
    console.log("accessToken => ", token);
    try {
      const response: AttendanceResponse = await AttendanceService.getStudentAttendance(queryParams, token);
      
      const currentPage = Math.floor((queryParams.offset || 0) / (queryParams.limit || DEFAULT_PAGE_SIZE)) + 1;
      
      setState({
        data: response.attendances || [],
        loading: false,
        error: null,
        totalCount: response.count || response.attendances?.length || 0,
        hasNext: !!response.next,
        hasPrevious: !!response.previous,
        currentPage,
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch attendance data';
      
      if (error instanceof AttendanceApiError) {
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
    await fetchAttendance(params, accessToken);
  }, [fetchAttendance, params, accessToken]);

  const fetchPage = useCallback(async (page: number) => {
    const newOffset = (page - 1) * (params.limit || DEFAULT_PAGE_SIZE);
    const newParams = { ...params, offset: newOffset };
    setParams(newParams);
    await fetchAttendance(newParams, accessToken);
  }, [fetchAttendance, params, accessToken]);

  const fetchByDate = useCallback(async (date: string) => {
    const newParams = { ...params, date, offset: 0 };
    setParams(newParams);
    await fetchAttendance(newParams, accessToken);
  }, [fetchAttendance, params, accessToken]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    // Only fetch if we have an accessToken
    if (accessToken && accessToken.trim() !== '') {
      fetchAttendance(params, accessToken);
    } else {
      // Set loading to false if no token available
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [fetchAttendance, params, accessToken]);


  return {
    ...state,
    refetch,
    fetchPage,
    fetchByDate,
    clearError,
  };
}