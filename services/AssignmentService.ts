"use server";

export async function getAssignments(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/assessments/`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Backend error:", errorData);
    throw new Error(errorData.detail || "Error fetching assignments");
  }

  const data = await response.json();
  return data.results; // Retourne directement le tableau des assignments
}


export async function createAssignment(
  formData: FormData,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/assessments/`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.detail || "Error creating assignment");
    }

    return await response.json();
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

