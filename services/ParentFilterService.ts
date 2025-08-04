import { BACKEND_BASE_URL } from '@/app/utils/constants';

export interface ParentChild {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  grade?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
}

export interface Level {
  id: string;
  name: string;
  grade?: number;
}

/**
 * Get parent's children from classes data
 * Since there's no direct endpoint for children, we'll extract them from classes
 */
export async function getParentChildren(
  accessToken: string,
  refreshToken: string
): Promise<ParentChild[]> {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  try {
    // Get classes by child to extract children names
    const url = `${BACKEND_BASE_URL}/classes/by_child/`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access children data.");
      } else {
        throw new Error("Error retrieving children data.");
      }
    }

    const data = await response.json();
    
    // Extract children from the response structure
    // The API returns: { "Child Name": [classes], ... }
    const children: ParentChild[] = Object.keys(data).map((childName, index) => {
      const nameParts = childName.split(' ');
      return {
        id: index + 1, // Generate ID since API doesn't provide it
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        email: '', // Not provided by this endpoint
        grade: undefined
      };
    });

    return children;
  } catch (error) {
    console.error("Error getting children:", error);
    // Fallback to empty array if API fails
    return [];
  }
}

/**
 * Get available subjects from classes data
 * Since there's no direct endpoint for subjects, we'll extract them from classes
 */
export async function getAvailableSubjects(
  accessToken: string,
  refreshToken: string
): Promise<Subject[]> {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  try {
    // Get all classes to extract unique subjects
    const url = `${BACKEND_BASE_URL}/classes/`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access subjects data.");
      } else {
        throw new Error("Error retrieving subjects data.");
      }
    }

    const data = await response.json();
    const classes = data.results || data;
    
    // Extract unique subjects from classes
    const subjectsMap = new Map<string, string>();
    classes.forEach((cls: any) => {
      if (cls.subject_in_all_letter) {
        subjectsMap.set(cls.subject_in_all_letter, cls.subject_in_short || cls.subject_in_all_letter);
      }
    });

    const subjects: Subject[] = Array.from(subjectsMap.entries()).map(([name, code], index) => ({
      id: (index + 1).toString(),
      name: name,
      code: code
    }));

    return subjects;
  } catch (error) {
    console.error("Error getting subjects:", error);
    // Fallback to common subjects
    return [
      { id: "1", name: "Mathematics", code: "Math" },
      { id: "2", name: "Science", code: "Sci" },
      { id: "3", name: "Literature", code: "Lit" },
      { id: "4", name: "History", code: "Hist" },
      { id: "5", name: "Geography", code: "Geo" }
    ];
  }
}

/**
 * Get available levels/grades from classes data
 * Since there's no direct endpoint for levels, we'll extract them from classes
 */
export async function getAvailableLevels(
  accessToken: string,
  refreshToken: string
): Promise<Level[]> {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  try {
    // Get all classes to extract unique levels
    const url = `${BACKEND_BASE_URL}/classes/`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access levels data.");
      } else {
        throw new Error("Error retrieving levels data.");
      }
    }

    const data = await response.json();
    const classes = data.results || data;
    
    // Extract unique levels from classes
    const levelsMap = new Map<string, number>();
    classes.forEach((cls: any) => {
      if (cls.grade) {
        levelsMap.set(cls.grade, parseInt(cls.grade));
      }
    });

    const levels: Level[] = Array.from(levelsMap.entries())
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([grade, gradeNum]) => ({
        id: grade,
        name: `Level ${grade}`,
        grade: gradeNum
      }));

    return levels;
  } catch (error) {
    console.error("Error getting levels:", error);
    // Fallback to common levels
    return [
      { id: "1", name: "Level 1", grade: 1 },
      { id: "2", name: "Level 2", grade: 2 },
      { id: "3", name: "Level 3", grade: 3 },
      { id: "4", name: "Level 4", grade: 4 },
      { id: "5", name: "Level 5", grade: 5 },
      { id: "6", name: "Level 6", grade: 6 },
      { id: "7", name: "Level 7", grade: 7 },
      { id: "8", name: "Level 8", grade: 8 }
    ];
  }
} 