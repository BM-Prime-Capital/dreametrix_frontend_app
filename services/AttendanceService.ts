"use server";


export async function getAttendances(
  params: { date: string; class_id: number; teacher_id: number },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${tenantPrimaryDomain}/attendances/get-attendances/?class_id=${params.class_id}&date=${params.date}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  });

  if (!response.ok) {
    const errorData = await response.json(); // Pour voir l'erreur détaillée du backend
    console.error("Erreur du backend:", errorData);
    throw new Error(errorData.message || "Erreur lors de la récupération des présences");
  }

  const responseData = await response.json();
  console.log("Réponse du backend:", responseData); // Affiche toute la réponse

  return responseData.attendances; // Retourne uniquement le tableau des présences
}

export async function updateAttendance(
  attendance: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const data = {
      updates: [
        {
          attendance_id: attendance.attendance_id,
          status: attendance.status,
          notes: "Not Applicable",
        },
      ],
    };
    const url = `${tenantPrimaryDomain}/attendances/update-attendances/`;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log("PUT Attendance data => ", data);
      return "ok";
    } else {
      console.log("PUT Attendance Failed => ", response);
      throw new Error("Attendance modification failed");
    }
  } catch (error) {
    console.log("Error => ", error);
  }
}

export async function getAttendanceGeneralView(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/attendances/general-view`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.log("Error response => ", response);
    if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux data.");
    } else {
      throw new Error("Erreur lors de la récupération des attendances.");
    }
  }

  const data = await response.json();

  return data;
}