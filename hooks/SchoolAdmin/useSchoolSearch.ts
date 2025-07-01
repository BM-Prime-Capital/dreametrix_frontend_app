import { useState, useEffect } from "react";
import { SchoolDisplay, searchSchools } from "@/services/user-service";

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
        console.log("Searching for schools with query:", searchQuery);
        //check if we are in development or production
        console.log(`Environment: ${process.env.NODE_ENV}`);
        const results = await searchSchools(searchQuery);
        console.log("Search results:", results);
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
