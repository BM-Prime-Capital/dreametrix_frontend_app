// API Configuration
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com",
  // Use local API routes for proxying requests to avoid CORS
  LOCAL_API_BASE:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : "/api",
  ENDPOINTS: {
    US_STATES: "/utilities/us-states/",
    US_CITIES_BY_STATE: "/utilities/us-cities-by-state",
    SCHOOLS_SEARCH: "/resources/school-search/search",
    // Local proxy endpoint for school search
    SCHOOLS_SEARCH_PROXY: "/schools/search",
    SCHOOLS_LIST: "/resources/school-search",
    SCHOOLS_DETAIL: "/resources/school-search",
    SCHOOLS_CREATE: "/resources/school-search",
    // Chat endpoints
    CHAT_MESSAGES: "/chats/messages/",
    CHAT_ROOMS: "/chats/rooms/",
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

// Helper function to build local API URLs (for proxying)
export const buildLocalApiUrl = (
  endpoint: string,
  params?: Record<string, string>
) => {
  let url = `${API_CONFIG.LOCAL_API_BASE}${endpoint}`;

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
