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
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Backend error:", errorData);
    throw new Error(errorData.detail || "Error fetching assignments");
  }

  const data = await response.json();
  console.log("Assignments data: ", data.results[0].course);
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
      body: formData,
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

export async function getSubmissions(
  assessmentId: number,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/submissions?assessment_id=${assessmentId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.detail || "Error fetching submissions");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

export async function getAssessmentWeights(
  courseId: number,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/assessments/classes/${courseId}/assessment_weights/`;
  console.log("URL => ", url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.detail || "Error fetching assessment weights");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}

export async function updateAssessmentWeights(
  courseId: number,
  weights: {
    test: number;
    quiz: number;
    homework: number;
    participation: number;
    other: number;
  },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/assessments/classes/${courseId}/assessment_weights/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
      body: JSON.stringify({ weights: weights }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.detail || "Error updating assessment weights");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error("Failed to connect to server");
  }
}
