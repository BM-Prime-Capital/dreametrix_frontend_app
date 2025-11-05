/* eslint-disable @typescript-eslint/no-explicit-any */
//"use server";

export async function getSchoolCreationRequests(
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  console.log("accessToken", accessToken)
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/school-requests/`;

  try {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        }
    });

    

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this data.");
      } else {
        throw new Error("Error while fetching students.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

export async function getAllSchools(
    accessToken: string
  ) {
    if (!accessToken) {
      throw new Error("You are not logged in. Please log in again.");
    }
  
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/schools/`;
    console.log("url", url)
  
    try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          }
      });
  
      
  
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("You don't have permission to access this data.");
        } else {
          throw new Error("Error while fetching students.");
        }
      }

      // console.log("response", await response.json())
  
      return await response.json();
    } catch (error: any) {
      console.error("Error fetching students:", error);
      throw error;
    }
  }

export async function getAllUSOfficialSchools(
  accessToken: string, 
  page: number = 1
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/resources/us-schools/?page=${page}`;
  console.log("url", url)

  try {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        }
    });

    

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this data.");
      } else {
        throw new Error("Error while fetching students.");
      }
    }

    // console.log("response", await response.json())

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

export async function searchUSOfficialSchools(
  accessToken: string,
  query: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  if (!query.trim()) {
    throw new Error("Search query cannot be empty.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/resources/school-search/search/?q=${encodeURIComponent(query.trim())}`;
  console.log("Searching schools at URL:", url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to search schools.");
      } else if (response.status === 400) {
        throw new Error("Invalid search query.");
      } else {
        throw new Error(`Error searching schools: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error searching schools:", error);
    throw error;
  }
}

export async function createUSOfficialSchool(
  accessToken: string,
  schoolData: any
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/resources/us-schools/`;
  console.log("Creating school at URL:", url);
  console.log("School data:", schoolData);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(schoolData)
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to create schools.");
      } else if (response.status === 400) {
        const errorData = await response.json();
        console.error("Validation error response:", errorData);
        throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
      } else {
        const errorText = await response.text();
        console.error("Create error response:", errorText);
        throw new Error(`Error creating school: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error creating school:", error);
    throw error;
  }
}

export async function deleteUSOfficialSchool(
  accessToken: string,
  schoolId: number
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/resources/us-schools/${schoolId}/`;
  console.log("Deleting school at URL:", url);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to delete this school.");
      } else if (response.status === 404) {
        throw new Error("School not found.");
      } else {
        const errorText = await response.text();
        console.error("Delete error response:", errorText);
        throw new Error(`Error deleting school: ${response.status} ${response.statusText}`);
      }
    }

    // DELETE requests typically don't return content, but we'll handle both cases
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true, message: "School deleted successfully" };
    }
    
    return await response.json();
  } catch (error: any) {
    console.error("Error deleting school:", error);
    throw error;
  }
}

export async function updateUSOfficialSchool(
  accessToken: string,
  schoolId: number,
  schoolData: any
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/resources/us-schools/${schoolId}/`;
  console.log("Updating school at URL:", url);
  console.log("School data:", schoolData);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(schoolData)
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to update this school.");
      } else if (response.status === 404) {
        throw new Error("School not found.");
      } else {
        const errorText = await response.text();
        console.error("Update error response:", errorText);
        throw new Error(`Error updating school: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating school:", error);
    throw error;
  }
}




export async function getAllCharacters(
  accessToken: string, 
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/utilities/character-list/`;
  console.log("url", url)

  try {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        }
    });

    

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this characters data.");
      } else {
        throw new Error("Error while fetching characters.");
      }
    }

    // console.log("response characters===>", await response.json())

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching characters:", error);
    throw error;
  }
}

export async function createCharacter(
  accessToken: string,
  characterData: {
    name: string;
    description: string;
    value_point: number;
    character_type: "good" | "bad";
  }
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/utilities/character-list/`;
  console.log("Creating character at URL:", url);
  console.log("Character data:", characterData);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(characterData),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to create characters.");
      } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
      } else {
        throw new Error("Error while creating character.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error creating character:", error);
    throw error;
  }
}

export async function updateCharacter(
  accessToken: string,
  characterId: number,
  characterData: {
    name: string;
    description: string;
    value_point: number;
    character_type: "good" | "bad";
  }
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/utilities/character-list/${characterId}/`;
  console.log("Updating character at URL:", url);
  console.log("Character data:", characterData);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(characterData),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to update characters.");
      } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(`Validation error: ${JSON.stringify(errorData)}`);
      } else if (response.status === 404) {
        throw new Error("Character not found.");
      } else {
        throw new Error("Error while updating character.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating character:", error);
    throw error;
  }
}

export async function deleteCharacter(
  accessToken: string,
  characterId: number
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/utilities/character-list/${characterId}/`;
  console.log("Deleting character at URL:", url);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to delete characters.");
      } else if (response.status === 404) {
        throw new Error("Character not found.");
      } else {
        throw new Error("Error while deleting character.");
      }
    }

    // DELETE requests typically return 204 No Content
    if (response.status === 204) {
      return { success: true };
    }
    
    return await response.json();
  } catch (error: any) {
    console.error("Error deleting character:", error);
    throw error;
  }
}