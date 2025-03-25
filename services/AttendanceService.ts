"use server";

import { redirect } from "next/navigation";

export async function getAttendances(
  initAttendanceData: { date: string; class_id: number; teacher_id: number }, // "04.17.2025"
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
    if (response.status === 401) {
      // throw new Error("Votre session a expiré. Veuillez vous reconnecter.");

      return redirect("/");

      /* const refreshResponse = await fetch(
        // TO BE Completed with the true refresh API
        `${tenantPrimaryDomain}/refresh-token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );
      console.log("refreshResponse => ", refreshResponse);
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // Retry the original request with the new access token
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        // Optionally, update your stored accessToken for future requests
        localStorage.setItem(localStorageKey.ACCESS_TOKEN, newAccessToken);
        localStorage.setItem(localStorageKey.REFRESH_TOKEN, newRefreshToken);
      } else {
        throw new Error("Failed to refresh the access token");
      }
       */
    } else if (response.status === 403) {
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
    const url = `${tenantPrimaryDomain}/attendances/${attendance.id}/`;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...attendance,
      }),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log("PUT Attendance data => ", data);
    } else {
      console.log("PUT Attendance Failed => ", response);
      if (response.status == 401) {
        return redirect("/");
      } else {
        throw new Error("Attendance modification failed");
      }
    }
  } catch (error) {
    console.log("Error => ", error);
  }
}
