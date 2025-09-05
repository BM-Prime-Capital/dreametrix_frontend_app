import { CharacterResponse, CharacterQueryParams } from '@/types/character';
import { BACKEND_BASE_URL } from '@/app/utils/constants';

export class CharacterApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any,
    public accessToken?: string
  ) {
    super(message);
    this.name = 'CharacterApiError';
  }
}

export class CharacterService {
  private static baseURL = BACKEND_BASE_URL;
  
  static async getStudentCharacterRatings(params: CharacterQueryParams = {}, accessToken?: string): Promise<CharacterResponse> {
    try {
      // Validate access token
      if (!accessToken || accessToken.trim() === '') {
        throw new CharacterApiError(
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

      const url = `${this.baseURL}/characters/character-ratings/student_view/?${searchParams.toString()}`;
      if (process.env.NODE_ENV === 'development') {
        console.log("Character API URL => ", url);
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
        throw new CharacterApiError(
          errorData.message || `HTTP Error: ${response.status}`,
          response.status,
          errorData,
          accessToken
        );
      }

      const data: CharacterResponse = await response.json();
      return data;
      
    } catch (error) {
      if (error instanceof CharacterApiError) {
        throw error;
      }
      
      throw new CharacterApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0,
        error,
        accessToken
      );
    }
  }

  static async getCharacterRatingsByDate(date: string, accessToken?: string): Promise<CharacterResponse> {
    return this.getStudentCharacterRatings({ date }, accessToken);
  }

  static async getCharacterRatingsByPeriod(period: string, accessToken?: string): Promise<CharacterResponse> {
    return this.getStudentCharacterRatings({ period }, accessToken);
  }
}