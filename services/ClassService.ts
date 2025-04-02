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
  return data.results;
}

export async function createClass(
  classData: ISchoolClass,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const url = `${tenantPrimaryDomain}/classes/`;

    const data = {
      ...classData,
      name: `Class ${classData.grade} - ${classData.subject_in_short}`,
      students: [1, 2], // TO UPDATE
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
      throw new Error("Class modification failed");
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
    const data = {
      ...classData,
      teacher: classData.teacher.id,
      students: classData.students.map((student: any) => student.id),
    };
    console.log("UPDATING Class => ", data);
    const url = `${tenantPrimaryDomain}/classes/${data.id}/`;
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

      return "ok";
    } else {
      console.log("PUT Class Failed => ", response);
      throw new Error("Class modification failed");
    }
  } catch (error) {
    console.log("Error => ", error);
  }
}
