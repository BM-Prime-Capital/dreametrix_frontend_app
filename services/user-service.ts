import { API_CONFIG, buildApiUrl, getApiHeaders } from "@/lib/api-config";

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
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SCHOOLS_SEARCH, { q: query });
    const response = await fetch(url, {
      headers: getApiHeaders(),
    });
    if (!response.ok) throw new Error("Failed to search schools");
    const schools: School[] = await response.json();
    return schools.map(convertSchoolToDisplay);
  } catch (error) {
    console.error("Error searching schools:", error);
    throw error;
  }
};

// Mock data for development/testing - Updated to match real API structure
export const mockSearchSchools = async (
  query: string
): Promise<SchoolDisplay[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockSchools: School[] = [
    {
      id: 1,
      SCHOOL_YEAR: "2024-2025",
      FIPST: "01",
      STATENAME: "Alabama",
      ST: "AL",
      SCH_NAME: "Lincoln Elementary School",
      LEA_NAME: "Springfield Public Schools",
      STATE_AGENCY_NO: "00123",
      UNION: "Springfield Teachers Union",
      ST_LEAID: "AL00123",
      LEAID: 123456789,
      ST_SCHID: "ALSCH00001",
      NCESSCH: 987654321,
      SCHID: 111222333,
      MSTREET1: "123 Main Street",
      MSTREET2: null,
      MSTREET3: null,
      MCITY: "Montgomery",
      MSTATE: "AL",
      MZIP: 36101,
      MZIP4: null,
      LSTREET1: null,
      LSTREET2: null,
      LSTREET3: null,
      LCITY: null,
      LSTATE: null,
      LZIP: null,
      LZIP4: null,
      PHONE: "(334) 555-0123",
      WEBSITE: "http://lincolnelem.edu",
      SY_STATUS: 1,
      SY_STATUS_TEXT: "Active",
      UPDATED_STATUS: null,
      UPDATED_STATUS_TEXT: null,
      EFFECTIVE_DATE: null,
      SCH_TYPE_TEXT: "Public School",
      SCH_TYPE: 101,
      RECON_STATUS: null,
      OUT_OF_STATE_FLAG: null,
      CHARTER_TEXT: null,
      CHARTAUTH1: null,
      CHARTAUTHN1: null,
      CHARTAUTH2: null,
      CHARTAUTHN2: null,
      NOGRADES: null,
      G_PK_OFFERED: null,
      G_KG_OFFERED: "Yes",
      G_1_OFFERED: "Yes",
      G_2_OFFERED: "Yes",
      G_3_OFFERED: "Yes",
      G_4_OFFERED: "Yes",
      G_5_OFFERED: "Yes",
      G_6_OFFERED: null,
      G_7_OFFERED: null,
      G_8_OFFERED: null,
      G_9_OFFERED: null,
      G_10_OFFERED: null,
      G_11_OFFERED: null,
      G_12_OFFERED: null,
      G_13_OFFERED: null,
      G_UG_OFFERED: null,
      G_AE_OFFERED: null,
      GSLO: null,
      GSHI: null,
      LEVEL: "Elementary",
      IGOFFERED: null,
    },
    {
      id: 2,
      SCHOOL_YEAR: "2024-2025",
      FIPST: "01",
      STATENAME: "Alabama",
      ST: "AL",
      SCH_NAME: "Washington High School",
      LEA_NAME: "Birmingham City Schools",
      STATE_AGENCY_NO: "00456",
      UNION: "Birmingham Teachers Union",
      ST_LEAID: "AL00456",
      LEAID: 456789123,
      ST_SCHID: "ALSCH00002",
      NCESSCH: 987654322,
      SCHID: 222333444,
      MSTREET1: "456 Oak Avenue",
      MSTREET2: "Suite 100",
      MSTREET3: null,
      MCITY: "Birmingham",
      MSTATE: "AL",
      MZIP: 35203,
      MZIP4: "1234",
      LSTREET1: null,
      LSTREET2: null,
      LSTREET3: null,
      LCITY: null,
      LSTATE: null,
      LZIP: null,
      LZIP4: null,
      PHONE: "(205) 555-0456",
      WEBSITE: "http://washingtonhs.birmingham.edu",
      SY_STATUS: 1,
      SY_STATUS_TEXT: "Active",
      UPDATED_STATUS: null,
      UPDATED_STATUS_TEXT: null,
      EFFECTIVE_DATE: null,
      SCH_TYPE_TEXT: "Public School",
      SCH_TYPE: 101,
      RECON_STATUS: null,
      OUT_OF_STATE_FLAG: null,
      CHARTER_TEXT: null,
      CHARTAUTH1: null,
      CHARTAUTHN1: null,
      CHARTAUTH2: null,
      CHARTAUTHN2: null,
      NOGRADES: null,
      G_PK_OFFERED: null,
      G_KG_OFFERED: null,
      G_1_OFFERED: null,
      G_2_OFFERED: null,
      G_3_OFFERED: null,
      G_4_OFFERED: null,
      G_5_OFFERED: null,
      G_6_OFFERED: null,
      G_7_OFFERED: null,
      G_8_OFFERED: null,
      G_9_OFFERED: "Yes",
      G_10_OFFERED: "Yes",
      G_11_OFFERED: "Yes",
      G_12_OFFERED: "Yes",
      G_13_OFFERED: null,
      G_UG_OFFERED: null,
      G_AE_OFFERED: null,
      GSLO: null,
      GSHI: null,
      LEVEL: "High",
      IGOFFERED: null,
    },
    {
      id: 3,
      SCHOOL_YEAR: "2024-2025",
      FIPST: "01",
      STATENAME: "Alabama",
      ST: "AL",
      SCH_NAME: "Roosevelt Middle School",
      LEA_NAME: "Mobile County Schools",
      STATE_AGENCY_NO: "00789",
      UNION: "Mobile Education Association",
      ST_LEAID: "AL00789",
      LEAID: 789123456,
      ST_SCHID: "ALSCH00003",
      NCESSCH: 987654323,
      SCHID: 333444555,
      MSTREET1: "789 Pine Road",
      MSTREET2: null,
      MSTREET3: null,
      MCITY: "Mobile",
      MSTATE: "AL",
      MZIP: 36601,
      MZIP4: null,
      LSTREET1: null,
      LSTREET2: null,
      LSTREET3: null,
      LCITY: null,
      LSTATE: null,
      LZIP: null,
      LZIP4: null,
      PHONE: "(251) 555-0789",
      WEBSITE: "http://rooseveltms.mobile.edu",
      SY_STATUS: 1,
      SY_STATUS_TEXT: "Active",
      UPDATED_STATUS: null,
      UPDATED_STATUS_TEXT: null,
      EFFECTIVE_DATE: null,
      SCH_TYPE_TEXT: "Public School",
      SCH_TYPE: 101,
      RECON_STATUS: null,
      OUT_OF_STATE_FLAG: null,
      CHARTER_TEXT: null,
      CHARTAUTH1: null,
      CHARTAUTHN1: null,
      CHARTAUTH2: null,
      CHARTAUTHN2: null,
      NOGRADES: null,
      G_PK_OFFERED: null,
      G_KG_OFFERED: null,
      G_1_OFFERED: null,
      G_2_OFFERED: null,
      G_3_OFFERED: null,
      G_4_OFFERED: null,
      G_5_OFFERED: null,
      G_6_OFFERED: "Yes",
      G_7_OFFERED: "Yes",
      G_8_OFFERED: "Yes",
      G_9_OFFERED: null,
      G_10_OFFERED: null,
      G_11_OFFERED: null,
      G_12_OFFERED: null,
      G_13_OFFERED: null,
      G_UG_OFFERED: null,
      G_AE_OFFERED: null,
      GSLO: null,
      GSHI: null,
      LEVEL: "Middle",
      IGOFFERED: null,
    },
    {
      id: 4,
      SCHOOL_YEAR: "2024-2025",
      FIPST: "01",
      STATENAME: "Alabama",
      ST: "AL",
      SCH_NAME: "Jefferson Charter Academy",
      LEA_NAME: "Jefferson Charter Schools",
      STATE_AGENCY_NO: "00321",
      ST_LEAID: "AL00321",
      LEAID: 321654987,
      ST_SCHID: "ALSCH00004",
      NCESSCH: 987654324,
      SCHID: 444555666,
      MSTREET1: "321 Elm Street",
      MSTREET2: "Building A",
      MSTREET3: null,
      MCITY: "Huntsville",
      MSTATE: "AL",
      MZIP: 35801,
      MZIP4: "5678",
      LSTREET1: null,
      LSTREET2: null,
      LSTREET3: null,
      LCITY: null,
      LSTATE: null,
      LZIP: null,
      LZIP4: null,
      PHONE: "(256) 555-0321",
      WEBSITE: "http://jeffersonacad.huntsville.edu",
      SY_STATUS: 1,
      SY_STATUS_TEXT: "Active",
      UPDATED_STATUS: null,
      UPDATED_STATUS_TEXT: null,
      EFFECTIVE_DATE: null,
      SCH_TYPE_TEXT: "Charter School",
      SCH_TYPE: 102,
      RECON_STATUS: null,
      OUT_OF_STATE_FLAG: null,
      CHARTER_TEXT: "Charter",
      CHARTAUTH1: "State Education Agency",
      CHARTAUTHN1: "Alabama Department of Education",
      CHARTAUTH2: null,
      CHARTAUTHN2: null,
      NOGRADES: null,
      G_PK_OFFERED: null,
      G_KG_OFFERED: "Yes",
      G_1_OFFERED: "Yes",
      G_2_OFFERED: "Yes",
      G_3_OFFERED: "Yes",
      G_4_OFFERED: "Yes",
      G_5_OFFERED: "Yes",
      G_6_OFFERED: "Yes",
      G_7_OFFERED: "Yes",
      G_8_OFFERED: "Yes",
      G_9_OFFERED: null,
      G_10_OFFERED: null,
      G_11_OFFERED: null,
      G_12_OFFERED: null,
      G_13_OFFERED: null,
      G_UG_OFFERED: null,
      G_AE_OFFERED: null,
      GSLO: null,
      GSHI: null,
      LEVEL: "Elementary/Middle",
      IGOFFERED: null,
    },
  ];

  if (!query || query.length < 2) {
    return [];
  }

  const filteredSchools = mockSchools.filter(
    (school) =>
      school.SCH_NAME.toLowerCase().includes(query.toLowerCase()) ||
      school.MCITY?.toLowerCase().includes(query.toLowerCase()) ||
      school.STATENAME?.toLowerCase().includes(query.toLowerCase()) ||
      school.LEA_NAME?.toLowerCase().includes(query.toLowerCase())
  );

  return filteredSchools.map(convertSchoolToDisplay);
};
