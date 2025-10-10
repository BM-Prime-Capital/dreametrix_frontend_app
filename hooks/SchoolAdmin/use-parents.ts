"use client";

import { useState, useEffect } from "react";
import { useBaseUrl } from "./use-base-url";
import { toast } from "react-toastify";
import { localStorageKey } from "@/constants/global";

export interface User {
  full_name: string | undefined;
  email: string;
  username: string;
  phone_number: string | null;
  first_name: string;
  last_name: string;
  date_joined: string;
  is_active: boolean;
}

export interface School {
  name: string;
  email: string;
  phone_number: string;
  code: string;
  is_active: boolean;
}

export interface Parent {
  id: number;
  user: User;
  school: School;
  uuid: string;
  created_at: string;
  last_update: string;
  extra_data: null;
}

export interface ParentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Parent[];
}

export function useParents() {
  const [parents, setParents] = useState<Parent[]>([]);
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

    const fetchParents = async () => {
      try {
        const accessToken = localStorage.getItem(localStorageKey.ACCESS_TOKEN);

        if (!accessToken) {
          throw new Error("You are not logged in. Please log in again.");
        }

        const response = await fetch(`${baseUrl}/parents/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Your session has expired. Please log in again.");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to access parents.");
          } else {
            throw new Error("Error loading parents.");
          }
        }

        const data: ParentsResponse = await response.json();
        console.log('Parents API Response:', data);
        console.log('Parents Results:', data.results);
        
        if (data && Array.isArray(data.results)) {
          setParents(data.results);
        } else if (Array.isArray(data)) {
          setParents(data as Parent[]);
        } else {
          console.warn('Unexpected API response format:', data);
          setParents([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error loading parents.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParents();
  }, [baseUrl, baseUrlError, refreshTrigger]);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { parents, isLoading, error, refetch };
}