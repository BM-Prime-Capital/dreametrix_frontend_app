/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

export async function getStudents(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/students/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

export async function updateClass(
  classId: number,
  studentIds: number[],
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/classes/${classId}/`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ students: studentIds }),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to update this class.");
      } else {
        throw new Error("Error while updating class.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating class:", error);
    throw error;
  }
}

export async function updateStudent(
  studentId: number,
  studentData: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/students/${studentId}/`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to update this student.");
      } else {
        throw new Error("Error while updating student.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating student:", error);
    throw error;
  }
}