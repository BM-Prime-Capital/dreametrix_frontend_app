//import { Character } from "@/components/character/Charracter";
"use server";

import { localStorageKey } from "@/constants/global";
import { redirect } from "next/navigation";
const characterPath = "/characters/character-rating/";
export async function getCharracters(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}${characterPath}`;
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

  console.log("getCharracters => ", data);

  return data.results;
}

export async function updateCharacter(
  character: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const url = `${tenantPrimaryDomain}${characterPath}${character.id}/`;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(character),
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
