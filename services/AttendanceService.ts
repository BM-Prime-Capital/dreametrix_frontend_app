"use server";

import { localStorageKey } from "@/constants/global";
import { redirect } from "next/navigation";

export async function getAttendances(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/attendances/`;
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

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
      throw new Error(
        "Vous n'avez pas la permission d'accéder aux enseignants."
      );
    } else {
      throw new Error("Erreur lors de la récupération des enseignants.");
    }
  }

  const data = await response.json();

  console.log("getAttendances => ", data);

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
    const url = `${tenantPrimaryDomain}/attendances/${attendance.id}/`;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...attendance,
        course_id: 1,
        notes: "good good",
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
