/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
export interface CreateTeacherRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  student_uuid: string;
  role: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export async function getTeachers(
  tenantPrimaryDomain: string,
  accessToken: string,
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/teachers/`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "Vous n'avez pas la permission d'accéder aux enseignants."
      );
    } else {
      throw new Error("Erreur lors de la récupération des enseignants.");
    }
  }

  const data = await response.json();

  return data.results;
}


export async function createTeacher(
  tenantPrimaryDomain: string,
  accessToken: string,
  teacherData: CreateTeacherRequest
): Promise<ApiResponse> {
  // Désactiver la vérification SSL seulement en développement
  if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  try {
    // const response = await fetch("https://backend-dreametrix.com/accounts/users/create/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(teacherData)
    // });

    // if (!response.ok) {
    //   const errorData = await safeParseJSON(response);
    //   return {
    //     success: false,
    //     message: errorData?.message || "Erreur lors de la création du compte."
    //   };
    // }

    // const data = await response.json();
    // return {
    //   success: true,
    //   data: data
    // };
  } catch (error) {
    console.error("Erreur réseau lors de la création du compte:", error);
    return {
      success: false,
      message: "Erreur réseau lors de la création du compte."
    };
  } finally {
    // Toujours réactiver la vérification SSL
    if (process.env.NODE_ENV === 'development') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
    }
  }
}

// Helper to prevent JSON.parse crashes
async function safeParseJSON(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function updateTeacher(
  teacher: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    console.log("UPDATING Teacher => ", {
      teacher,
      tenantPrimaryDomain,
      accessToken,
      refreshToken,
    });
    const url = `${tenantPrimaryDomain}/teachers/${teacher.id}/`;
    const response = await fetch(url, {
      method: "PUT", // replace by PUT
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...teacher,
        course_id: 1,
        notes: "good good",
      }),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log("PUT Teacher data => ", data);
    } else {
      console.log("PUT Teacher Failed => ", response);
      throw new Error("Teacher modification failed");
    }
  } catch (error) {
    console.log("Error => ", error);
  }
}
