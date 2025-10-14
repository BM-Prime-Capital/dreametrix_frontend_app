import { RewardsResponse, RewardsQueryParams } from '@/types/rewards';

export class RewardsApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any,
    public accessToken?: string
  ) {
    super(message);
    this.name = 'RewardsApiError';
  }
}

export class RewardsService {
  static async getStudentRewards(tenantDomain: string, params: RewardsQueryParams = {}, accessToken?: string): Promise<RewardsResponse> {
    try {
      // Validate tenant domain
      if (!tenantDomain || tenantDomain.trim() === '') {
        throw new RewardsApiError(
          'Tenant domain not provided. Please login again.',
          400,
          { code: 'NO_TENANT' }
        );
      }

      // Validate access token
      if (!accessToken || accessToken.trim() === '') {
        throw new RewardsApiError(
          'No access token provided. Please log in again.',
          401,
          { code: 'NO_TOKEN' }
        );
      }

      const searchParams = new URLSearchParams();

      if (params.date) {
        searchParams.append('date', params.date);
      }

      if (params.period) {
        searchParams.append('period', params.period);
      }

      if (params.class_info) {
        searchParams.append('class_info', params.class_info.toString());
      }

      const url = `https://${tenantDomain}/rewards/student-reports/student_view/?${searchParams.toString()}`;
      if (process.env.NODE_ENV === 'development') {
        console.log("Rewards API URL => ", url);
        console.log("Token length => ", accessToken.length);
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new RewardsApiError(
          errorData.message || `HTTP Error: ${response.status}`,
          response.status,
          errorData,
          accessToken
        );
      }

      const data: RewardsResponse = await response.json();
      return data;
      
    } catch (error) {
      if (error instanceof RewardsApiError) {
        throw error;
      }
      
      throw new RewardsApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0,
        error,
        accessToken
      );
    }
  }

  static async getStudentRewardsByDate(tenantDomain: string, date: string, accessToken?: string): Promise<RewardsResponse> {
    return this.getStudentRewards(tenantDomain, { date }, accessToken);
  }

  static async getStudentRewardsByPeriod(tenantDomain: string, period: string, accessToken?: string): Promise<RewardsResponse> {
    return this.getStudentRewards(tenantDomain, { period }, accessToken);
  }
}