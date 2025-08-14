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

export interface Teacher {
  id: number;
  user: User;
  school: School;
  uuid: string;
  created_at: string;
  last_update: string;
  extra_data: null;
}

export interface TeachersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Teacher[];
}

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { baseUrl, error: baseUrlError } = useBaseUrl();

  useEffect(() => {
    if (baseUrlError) {
      setError(baseUrlError);
      setIsLoading(false);
      return;
    }

    if (!baseUrl) {
      return; // Wait for baseUrl to be available
    }

    const fetchTeachers = async () => {
      try {
        const accessToken = localStorage.getItem(localStorageKey.ACCESS_TOKEN);

        if (!accessToken) {
          throw new Error(
            "Vous n'êtes pas connecté. Veuillez vous reconnecter."
          );
        }

        const response = await fetch(`${baseUrl}/teachers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Votre session a expiré. Veuillez vous reconnecter."
            );
          } else if (response.status === 403) {
            throw new Error(
              "Vous n'avez pas la permission d'accéder aux enseignants."
            );
          } else {
            throw new Error("Erreur lors de la récupération des enseignants.");
          }
        }

        const data: TeachersResponse = await response.json();
        setTeachers(data.results);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des enseignants.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [baseUrl, baseUrlError]);

  return { teachers, isLoading, error };
}
