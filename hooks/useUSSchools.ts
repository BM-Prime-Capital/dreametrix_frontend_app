import { useState, useCallback } from 'react';
import { getAllUSOfficialSchools, updateUSOfficialSchool, createUSOfficialSchool, deleteUSOfficialSchool, searchUSOfficialSchools } from '@/services/super-admin-service';

export type USOfficialSchool = {
  id: number;
  SCHOOL_YEAR: string;
  FIPST: string;
  STATENAME: string;
  ST: string;
  SCH_NAME: string;
  LEA_NAME: string;
  STATE_AGENCY_NO: string;
  UNION: string | null;
  ST_LEAID: string;
  LEAID: number;
  ST_SCHID: string;
  NCESSCH: number;
  SCHID: number;
  MSTREET1: string;
  MSTREET2: string | null;
  MSTREET3: string | null;
  MCITY: string;
  MSTATE: string;
  MZIP: number;
  MZIP4: number;
  LSTREET1: string;
  LSTREET2: string | null;
  LSTREET3: string | null;
  LCITY: string;
  LSTATE: string;
  LZIP: number;
  LZIP4: number;
  PHONE: string;
  WEBSITE: string;
  SY_STATUS: number;
  SY_STATUS_TEXT: string;
  UPDATED_STATUS: number;
  UPDATED_STATUS_TEXT: string;
  EFFECTIVE_DATE: string;
  SCH_TYPE_TEXT: string;
  SCH_TYPE: number;
  RECON_STATUS: string;
  OUT_OF_STATE_FLAG: string;
  CHARTER_TEXT: string;
  CHARTAUTH1: string | null;
  CHARTAUTHN1: string | null;
  CHARTAUTH2: string | null;
  CHARTAUTHN2: string | null;
  NOGRADES: string;
  G_PK_OFFERED: string;
  G_KG_OFFERED: string;
  G_1_OFFERED: string;
  G_2_OFFERED: string;
  G_3_OFFERED: string;
  G_4_OFFERED: string;
  G_5_OFFERED: string;
  G_6_OFFERED: string;
  G_7_OFFERED: string;
  G_8_OFFERED: string;
  G_9_OFFERED: string;
  G_10_OFFERED: string;
  G_11_OFFERED: string;
  G_12_OFFERED: string;
  G_13_OFFERED: string;
  G_UG_OFFERED: string;
  G_AE_OFFERED: string;
  GSLO: string;
  GSHI: string;
  LEVEL: string;
  IGOFFERED: string;
};

export type USSchoolsResponse = {
  results: USOfficialSchool[];
  count: number;
  next: string | null;
  previous: string | null;
};

export const useUSSchools = (accessToken: string) => {
  const [schools, setSchools] = useState<USOfficialSchool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<USOfficialSchool[]>([]);

  const loadSchools = useCallback(async (page: number = 1) => {
    if (!accessToken) {
      setError("No access token provided");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: USSchoolsResponse = await getAllUSOfficialSchools(accessToken, page);
      setSchools(response.results || []);
      setTotalCount(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / 20));
      setCurrentPage(page);
    } catch (err: unknown) {
      console.error("Error loading US schools:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load US schools";
      setError(errorMessage);
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const refreshSchools = useCallback(async () => {
    await loadSchools(currentPage);
  }, [loadSchools, currentPage]);

  const searchSchools = useCallback(async (query: string) => {
    if (!accessToken) {
      setError("No access token provided");
      return;
    }

    if (!query.trim()) {
      // If query is empty, exit search mode and load regular schools
      setIsSearchMode(false);
      setSearchQuery("");
      setSearchResults([]);
      await loadSchools(1);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchQuery(query.trim());

    try {
      const response = await searchUSOfficialSchools(accessToken, query.trim());
      console.log("Search response:", response);
      
      // Handle different response formats - could be array or object with results
      const results = Array.isArray(response) ? response : (response.results || response);
      
      setSearchResults(results);
      setIsSearchMode(true);
    } catch (err: unknown) {
      console.error("Error searching schools:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to search schools";
      setError(errorMessage);
      setSearchResults([]);
      setIsSearchMode(false);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, loadSchools]);

  const goToPage = useCallback(async (page: number) => {
    if (page >= 1 && page <= totalPages) {
      await loadSchools(page);
    }
  }, [loadSchools, totalPages]);

  const nextPage = useCallback(async () => {
    if (currentPage < totalPages) {
      await goToPage(currentPage + 1);
    }
  }, [goToPage, currentPage, totalPages]);

  const previousPage = useCallback(async () => {
    if (currentPage > 1) {
      await goToPage(currentPage - 1);
    }
  }, [goToPage, currentPage]);

  // CRUD Operations
  const createSchool = useCallback(async (schoolData: Partial<USOfficialSchool>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      console.log("Creating school:", schoolData);
      
      // Call the create API
      const newSchool = await createUSOfficialSchool(accessToken, schoolData);
      
      // Add the new school to the local state
      setSchools(prevSchools => [newSchool, ...prevSchools]);
      
      // Update total count
      setTotalCount(prevCount => prevCount + 1);
      
      return { success: true, message: "School created successfully", data: newSchool };
    } catch (err: unknown) {
      console.error("Error creating school:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create school";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const updateSchool = useCallback(async (id: number, schoolData: Partial<USOfficialSchool>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      console.log("Updating school:", id, schoolData);
      
      // Call the update API
      const updatedSchool = await updateUSOfficialSchool(accessToken, id, schoolData);
      
      // Update the school in the local state
      setSchools(prevSchools => 
        prevSchools.map(school => 
          school.id === id ? { ...school, ...updatedSchool } : school
        )
      );
      
      return { success: true, message: "School updated successfully", data: updatedSchool };
    } catch (err: unknown) {
      console.error("Error updating school:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update school";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const deleteSchool = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      console.log("Deleting school:", id);
      
      // Call the delete API
      await deleteUSOfficialSchool(accessToken, id);
      
      // Remove the school from the local state
      setSchools(prevSchools => prevSchools.filter(school => school.id !== id));
      
      // Update total count
      setTotalCount(prevCount => prevCount - 1);
      
      return { success: true, message: "School deleted successfully" };
    } catch (err: unknown) {
      console.error("Error deleting school:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete school";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const clearSearch = useCallback(async () => {
    setIsSearchMode(false);
    setSearchQuery("");
    setSearchResults([]);
    await loadSchools(1);
  }, [loadSchools]);

  const getSchoolById = useCallback((id: number) => {
    // Check both regular schools and search results
    const allSchools = isSearchMode ? searchResults : schools;
    return allSchools.find(school => school.id === id);
  }, [schools, searchResults, isSearchMode]);

  return {
    // State
    schools: isSearchMode ? searchResults : schools,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    searchQuery,
    isSearchMode,
    
    // Actions
    loadSchools,
    refreshSchools,
    goToPage,
    nextPage,
    previousPage,
    searchSchools,
    clearSearch,
    
    // CRUD Operations
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolById,
    
    // Computed
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    isEmpty: (isSearchMode ? searchResults : schools).length === 0 && !isLoading,
  };
};
