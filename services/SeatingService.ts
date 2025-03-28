"use server";

import { redirect } from "next/navigation";

export async function getSeatings(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  console.log("Sending getSeatings payload => ", {
    tenantPrimaryDomain,
    accessToken,
    refreshToken,
  });
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/seatings/`;
  let response = await fetch(url, {
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

  console.log("getSeatings => ", data);

  return data.results;
}

export async function updateAttendance(
  attendance: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    console.log("UPDATING Attendance => ", {
      attendance,
      tenantPrimaryDomain,
      accessToken,
      refreshToken,
    });
    const url = `${tenantPrimaryDomain}/seatings/`;
    let response = await fetch(url, {
      method: "POST", // replace by PUT
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...attendance,
        course_id: 1,
        student: 1,
        notes: "good good",
      }),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log("PUT Attendance data => ", data);
    } else {
      console.log("PUT Attendance Failed => ", response);
      throw new Error("Attendance modification failed");
    }
  } catch (error) {
    console.log("Error => ", error);
  }
}
