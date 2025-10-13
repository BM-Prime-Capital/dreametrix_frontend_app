import { useState, useCallback, useEffect } from "react";
import { getAllCharacters, createCharacter, updateCharacter, deleteCharacter } from "@/services/super-admin-service";

export type Character = {
  id: number;
  name: string;
  description: string;
  value_point: number;
  character_type: "good" | "bad";
};

export type CharactersResponse = {
  good_characters: Character[];
  bad_characters: Character[];
};

export const useCharacters = () => {
  const [goodCharacters, setGoodCharacters] = useState<Character[]>([]);
  const [badCharacters, setBadCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combined characters for easier access
  const allCharacters = [...goodCharacters, ...badCharacters];
  const totalCount = goodCharacters.length + badCharacters.length;

  const loadCharacters = useCallback(async (accessToken: string) => {
    if (!accessToken) {
      setError("No access token available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: CharactersResponse = await getAllCharacters(accessToken);
      
      if (response && typeof response === 'object') {
        setGoodCharacters(response.good_characters || []);
        setBadCharacters(response.bad_characters || []);
      } else {
        setError("Invalid response format from server");
        setGoodCharacters([]);
        setBadCharacters([]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load characters";
      setError(errorMessage);
      setGoodCharacters([]);
      setBadCharacters([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCharacters = useCallback(async (accessToken: string) => {
    await loadCharacters(accessToken);
  }, [loadCharacters]);

  const createNewCharacter = useCallback(async (
    accessToken: string,
    characterData: {
      name: string;
      description: string;
      value_point: number;
      character_type: "good" | "bad";
    }
  ) => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    try {
      const response = await createCharacter(accessToken, characterData);
      
      // After successful creation, refresh the characters list
      await loadCharacters(accessToken);
      
      return { success: true, data: response };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create character";
      return { success: false, error: errorMessage };
    }
  }, [loadCharacters]);

  const updateExistingCharacter = useCallback(async (
    accessToken: string,
    characterId: number,
    characterData: {
      name: string;
      description: string;
      value_point: number;
      character_type: "good" | "bad";
    }
  ) => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    try {
      const response = await updateCharacter(accessToken, characterId, characterData);
      
      // After successful update, refresh the characters list
      await loadCharacters(accessToken);
      
      return { success: true, data: response };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update character";
      return { success: false, error: errorMessage };
    }
  }, [loadCharacters]);

  const deleteExistingCharacter = useCallback(async (
    accessToken: string,
    characterId: number
  ) => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    try {
      const response = await deleteCharacter(accessToken, characterId);
      
      // After successful deletion, refresh the characters list
      await loadCharacters(accessToken);
      
      return { success: true, data: response };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete character";
      return { success: false, error: errorMessage };
    }
  }, [loadCharacters]);

  const isEmpty = allCharacters.length === 0;

  return {
    goodCharacters,
    badCharacters,
    allCharacters,
    isLoading,
    error,
    totalCount,
    isEmpty,
    loadCharacters,
    refreshCharacters,
    createNewCharacter,
    updateExistingCharacter,
    deleteExistingCharacter,
  };
};
