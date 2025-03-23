"use server";

import { ISchoolClass } from "@/types";
import { redirect } from "next/navigation";

export async function getClasses(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/classes/`;
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      return redirect("/");
    } else if (response.status === 403) {
      throw new Error(
        "Vous n'avez pas la permission d'accéder aux enseignants."
      );
    } else {
      throw new Error("Erreur lors de la récupération des enseignants.");
    }
  }

  const data = await response.json();

  console.log("getClasss => ", data);

  return data.results;
}

export async function createClass(
  classData: ISchoolClass,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    console.log("CREATING Class => ", {
      classData,
      tenantPrimaryDomain,
      accessToken,
      refreshToken,
    });

    const url = `${tenantPrimaryDomain}/classes/`;
    const defautSchedule = {
      Monday: [
        {
          date: "2023-09-04",
          start_time: "09:00",
          end_time: "10:30",
        },
        {
          date: "2023-09-11",
          start_time: "09:00",
          end_time: "10:30",
        },
      ],
      Wednesday: [
        {
          date: "2023-09-06",
          start_time: "09:00",
          end_time: "10:30",
        },
        {
          date: "2023-09-13",
          start_time: "15:00",
          end_time: "16:30",
        },
      ],
      Friday: [
        {
          date: "2023-09-08",
          start_time: "11:00",
          end_time: "12:30",
        },
        {
          date: "2023-09-15",
          start_time: "13:00",
          end_time: "14:30",
        },
      ],
    };
    const data = {
      ...classData,
      hours_and_dates_of_course_schedule: defautSchedule, // TO update
      name: `Class ${classData.grade} - ${classData.subject_in_short}`,
      students: [1, 2],
      description: `Class ${classData.grade} - ${classData.subject_in_short}`,
    };
    console.log("CLASS PAYLOAD => ", data);
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data: any = await response.json();
      return "ok";
    } else {
      console.log("POST Class Failed => ", response);
      if (response.status === 401) {
        return redirect("/");
      } else {
        throw new Error("Class modification failed");
      }
    }
  } catch (error) {
    console.log("Error => ", error);
  }
}

export async function updateClass(
  classData: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    console.log("UPDATING Class => ", {
      classData,
      tenantPrimaryDomain,
      accessToken,
      refreshToken,
    });
    const url = `${tenantPrimaryDomain}/classes/${classData.id}/`;
    let response = await fetch(url, {
      method: "PUT", // replace by PUT
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...classData,
        course_id: 1,
        notes: "good good",
      }),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log("PUT Class data => ", data);
    } else {
      console.log("PUT Class Failed => ", response);
      if (response.status === 401) {
        return redirect("/");
      } else {
        throw new Error("Class modification failed");
      }
    }
  } catch (error) {
    console.log("Error => ", error);
  }
}
