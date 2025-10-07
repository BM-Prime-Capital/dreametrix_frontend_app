/* eslint-disable @typescript-eslint/no-explicit-any */
//"use server";

export async function getSchoolCreationRequests(
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  console.log("accessToken", accessToken)
  const url = `https://backend-dreametrix.com/school-requests/`;

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
  
    const url = `https://backend-dreametrix.com/schools/`;
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
  
      return await response.json();
    } catch (error: any) {
      console.error("Error fetching students:", error);
      throw error;
    }
  }
