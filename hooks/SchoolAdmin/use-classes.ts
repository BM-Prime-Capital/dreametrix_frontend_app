"use client";

import { useState, useEffect } from "react";
import { useBaseUrl } from "./use-base-url";
import { toast } from "react-toastify";
import { localStorageKey } from "@/constants/global";

export interface ClassData {
  id: number;
  name: string;
  grade_level: string;
  subject: string;
  teacher: string;
  student_count: number;
  created_at: string;
  last_update: string;
}

export interface ClassesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClassData[];
}

export function useClasses() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { baseUrl, error: baseUrlError } = useBaseUrl();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (baseUrlError) {
      setError(baseUrlError);
      setIsLoading(false);
      return;
    }

    if (!baseUrl) {
      return;
    }

    const fetchClasses = async () => {
      try {
        const accessToken = localStorage.getItem(localStorageKey.ACCESS_TOKEN);

        if (!accessToken) {
          throw new Error("You are not logged in. Please log in again.");
        }

        const response = await fetch(`${baseUrl}/classes/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Your session has expired. Please log in again.");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to access classes.");
          } else {
            throw new Error("Error loading classes.");
          }
        }

        const data: ClassesResponse = await response.json();
        console.log('Classes API Response:', data);
        console.log('Classes Results:', data.results);
        
        if (data && Array.isArray(data.results)) {
          setClasses(data.results);
        } else if (Array.isArray(data)) {
          setClasses(data as ClassData[]);
        } else {
          console.warn('Unexpected API response format:', data);
          setClasses([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error loading classes.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [baseUrl, baseUrlError, refreshTrigger]);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { classes, isLoading, error, refetch };
}