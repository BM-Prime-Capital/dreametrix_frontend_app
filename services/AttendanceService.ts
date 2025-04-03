"use server";

import { redirect } from "next/navigation";

export async function getAttendances(
  initAttendanceData: { date: string; class_id: number; teacher_id: number },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  console.log("initAttendanceData => ", initAttendanceData);
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/attendances/initialize-attendance/`;
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(initAttendanceData),
  });

  console.log("ATTENDANCE INIT resp", response);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux data.");
    } else {
      throw new Error("Erreur lors de la récupération des attendances.");
    }
  }

  const data = await response.json();

  console.log("getAttendances => ", data);

  return data.attendances;
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
    } else {
      console.log("PUT Attendance Failed => ", response);
      throw new Error("Attendance modification failed");
    }
  } catch (error) {
    console.log("Error => ", error);
  }
}
