import { useState, useEffect } from "react";
import {
  SchoolDisplay,
  searchSchools,
  mockSearchSchools,
} from "@/services/user-service";

export const useSchoolSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SchoolDisplay[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search with debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setHasSearched(true);
      try {
        // Use mock data in development, real API in production
        const results =
          process.env.NODE_ENV === "development"
            ? await mockSearchSchools(searchQuery)
            : await searchSchools(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("School search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    hasSearched,
    clearSearch,
  };
};
