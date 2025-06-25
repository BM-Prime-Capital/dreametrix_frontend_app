// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com",
  ENDPOINTS: {
    US_STATES: "/utilities/us-states/",
    US_CITIES_BY_STATE: "/utilities/us-cities-by-state",
    SCHOOLS_SEARCH: "/api/us-schools/search",
    SCHOOLS_LIST: "/api/us-schools/",
    SCHOOLS_DETAIL: "/api/us-schools",
    SCHOOLS_CREATE: "/api/us-schools",
  },
};

// Helper function to build full URL
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string>
) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  return url;
};

// Common headers for API requests
export const getApiHeaders = () => ({
  "Content-Type": "application/json",
  // Add authentication headers here if needed
  // 'Authorization': `Bearer ${token}`,
});

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}
