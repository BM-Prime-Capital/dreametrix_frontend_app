import {
  API_CONFIG,
  buildApiUrl,
  getApiHeaders,
  buildLocalApiUrl,
} from "@/lib/api-config";

// Types - Based on your complete API structure
export interface School {
  id?: number;
  SCHOOL_YEAR?: string;
  FIPST?: string;
  STATENAME?: string;
  ST?: string;
  SCH_NAME: string;
  LEA_NAME?: string;
  STATE_AGENCY_NO?: string;
  UNION?: string;
  ST_LEAID?: string;
  LEAID?: number;
  ST_SCHID?: string;
  NCESSCH?: number;
  SCHID?: number;
  MSTREET1?: string;
  MSTREET2?: string | null;
  MSTREET3?: string | null;
  MCITY?: string;
  MSTATE?: string;
  MZIP?: number;
  MZIP4?: string | null;
  LSTREET1?: string | null;
  LSTREET2?: string | null;
  LSTREET3?: string | null;
  LCITY?: string | null;
  LSTATE?: string | null;
  LZIP?: string | null;
  LZIP4?: string | null;
  PHONE?: string;
  WEBSITE?: string;
  SY_STATUS?: number;
  SY_STATUS_TEXT?: string;
  UPDATED_STATUS?: string | null;
  UPDATED_STATUS_TEXT?: string | null;
  EFFECTIVE_DATE?: string | null;
  SCH_TYPE_TEXT?: string;
  SCH_TYPE?: number;
  RECON_STATUS?: string | null;
  OUT_OF_STATE_FLAG?: string | null;
  CHARTER_TEXT?: string | null;
  CHARTAUTH1?: string | null;
  CHARTAUTHN1?: string | null;
  CHARTAUTH2?: string | null;
  CHARTAUTHN2?: string | null;
  NOGRADES?: string | null;
  G_PK_OFFERED?: string | null;
  G_KG_OFFERED?: string | null;
  G_1_OFFERED?: string | null;
  G_2_OFFERED?: string | null;
  G_3_OFFERED?: string | null;
  G_4_OFFERED?: string | null;
  G_5_OFFERED?: string | null;
  G_6_OFFERED?: string | null;
  G_7_OFFERED?: string | null;
  G_8_OFFERED?: string | null;
  G_9_OFFERED?: string | null;
  G_10_OFFERED?: string | null;
  G_11_OFFERED?: string | null;
  G_12_OFFERED?: string | null;
  G_13_OFFERED?: string | null;
  G_UG_OFFERED?: string | null;
  G_AE_OFFERED?: string | null;
  GSLO?: string | null;
  GSHI?: string | null;
  LEVEL?: string;
  IGOFFERED?: string | null;
}

// Helper interface for simplified display
export interface SchoolDisplay {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  phone?: string;
  district?: string;
}

// Convert API School to display format
export const convertSchoolToDisplay = (school: School): SchoolDisplay => {
  // Build complete address from multiple street fields
  const addressParts = [
    school.MSTREET1,
    school.MSTREET2,
    school.MSTREET3,
  ].filter(Boolean);

  const fullAddress = addressParts.join(", ");

  return {
    id: school.id?.toString() || school.SCHID?.toString() || "0",
    name: school.SCH_NAME,
    address: fullAddress,
    city: school.MCITY || "",
    state: school.STATENAME || school.MSTATE || "",
    zip_code:
      school.MZIP?.toString() ||
      (school.MZIP4 ? `${school.MZIP}-${school.MZIP4}` : undefined),
    phone: school.PHONE,
    district: school.LEA_NAME,
  };
};

export const fetchUSStates = async (): Promise<string[]> => {
  try {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.US_STATES);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch states");
    return await response.json();
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};

export const fetchCitiesByState = async (state: string): Promise<string[]> => {
  try {
    const url = buildApiUrl(
      `${API_CONFIG.ENDPOINTS.US_CITIES_BY_STATE}/${encodeURIComponent(state)}/`
    );
    console.log(`Fetching cities for state: ${state}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch cities");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching cities for state ${state}:`, error);
    throw error;
  }
};

export const searchSchools = async (
  query: string
): Promise<SchoolDisplay[]> => {
  try {
    // Use local API proxy to avoid CORS issues
    const url = buildLocalApiUrl(API_CONFIG.ENDPOINTS.SCHOOLS_SEARCH_PROXY, {
      q: query,
    });
    console.log(`Searching schools with query: ${query}, URL: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.error || "Unknown error"
        }`
      );
    }

    const schools: School[] = await response.json();
    return schools.map(convertSchoolToDisplay);
  } catch (error) {
    console.error("Error searching schools:", error);
    throw error;
  }
};

// End of user-service.ts
