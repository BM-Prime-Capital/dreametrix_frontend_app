/* eslint-disable @typescript-eslint/no-explicit-any */
//"use server";

export async function getStudents(
  tenantPrimaryDomain: string,
  accessToken: string
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
  refreshToken: string,
  teacherId: number 
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
      body: JSON.stringify({ 
        students: studentIds,
        teacher: teacherId 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      if (response.status === 403) {
        throw new Error("You don't have permission to update this class.");
      } else {
        throw new Error(`Error while updating class: ${response.status} - ${JSON.stringify(errorData)}`);
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
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }
  
  const url = `${tenantPrimaryDomain}/classes/users/${studentId}/`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(studentData),
    });
// console.log("response", response);
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


export async function confirmParentLink(
  url: string,
  parentId: number,
  accessToken: string
) {
  try {
    
    
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ parent_id: parentId }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        success: false,
        message: errorData || "Error confirming parent link."
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: "Network error while confirming parent link."
    };
  }
}

export async function enrollStudentsToClass(
  classId: number,
  studentIds: number[],
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/classes/${classId}/enroll/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ students: studentIds }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 403) {
        throw new Error("You don't have permission to enroll students to this class.");
      } else {
        throw new Error(`Error while enrolling students: ${response.status} - ${JSON.stringify(errorData)}`);
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error enrolling students:", error);
    throw error;
  }
}

export async function unenrollStudentsFromClass(
  classId: number,
  studentIds: number[],
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const url = `${tenantPrimaryDomain}/classes/${classId}/unenroll/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ students: studentIds }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 403) {
        throw new Error("You don't have permission to unenroll students from this class.");
      } else {
        throw new Error(`Error while unenrolling students: ${response.status} - ${JSON.stringify(errorData)}`);
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error unenrolling students:", error);
    throw error;
  }
}