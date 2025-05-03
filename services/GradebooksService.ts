"use server";

const characterPath = "/characters/initialize-class/";


export async function getGradeBookList(
    tenantPrimaryDomain: string,
    accessToken: string,
    refreshToken: string
  ) {
    if (!accessToken) {
      throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
    }
    const url = `${tenantPrimaryDomain}/gradebooks/`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  
    return data;
  }
  

export async function getGradeBookFocusList(
    tenantPrimaryDomain: string,
    accessToken: string,
    id: string,
    refreshToken: string
  ) {
    if (!accessToken) {
      throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
    }
    const url = `${tenantPrimaryDomain}/gradebooks/${id}`;
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "Vous n'avez pas la permission d'accéder aux enseignants."
        );
      } else {
        throw new Error(`Erreur lors de la récupération des enseignants. URL: ${url}`);

      }
    }
  
    const data = await response.json();
  
    return data;
  }
