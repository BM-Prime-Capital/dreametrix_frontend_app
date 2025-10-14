import { AttendanceResponse, AttendanceQueryParams } from '@/types/attendance';
import { getBackendUrl } from '@/app/utils/tenant';

export class AttendanceApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any,
    public accessToken?: string
  ) {
    super(message);
    this.name = 'AttendanceApiError';
  }
}

export class AttendanceService {
  private static baseURL = getBackendUrl();
  
  static async getStudentAttendance(params: AttendanceQueryParams = {}, accessToken?: string): Promise<AttendanceResponse> {
    try {
      // Validate access token
      if (!accessToken || accessToken.trim() === '') {
        throw new AttendanceApiError(
          'No access token provided. Please log in again.',
          401,
          { code: 'NO_TOKEN' }
        );
      }

      const searchParams = new URLSearchParams();
      
      if (params.limit) {
        searchParams.append('limit', params.limit.toString());
      }
      
      if (params.offset) {
        searchParams.append('offset', params.offset.toString());
      }
      
      if (params.date) {
        searchParams.append('date', params.date);
      }
      
      if (params.status) {
        searchParams.append('status', params.status);
      }

      const url = `${this.baseURL}/attendances/student_view/?${searchParams.toString()}`;
      console.log("API URL => ", url);
      console.log("Token length => ", accessToken.length);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AttendanceApiError(
          errorData.message || `HTTP Error: ${response.status}`,
          response.status,
          errorData,
          accessToken
        );
      }

      const data: AttendanceResponse = await response.json();
      return data;
      
    } catch (error) {
      if (error instanceof AttendanceApiError) {
        throw error;
      }
      
      throw new AttendanceApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0,
        error,
        accessToken
      );
    }
  }

  static async getAttendanceByDate(date: string, accessToken?: string): Promise<AttendanceResponse> {
    return this.getStudentAttendance({ date }, accessToken);
  }

  static async getAttendanceWithPagination(
    limit: number = 10, 
    offset: number = 0,
    accessToken?: string
  ): Promise<AttendanceResponse> {
    return this.getStudentAttendance({ limit, offset }, accessToken);
  }
}