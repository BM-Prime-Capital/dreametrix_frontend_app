/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

export async function getStudents(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${tenantPrimaryDomain}/students/`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Vous n'avez pas la permission d'accéder à ces données.");
      } else {
        throw new Error("Erreur lors de la récupération des étudiants.");
      }
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching students:", error);
    throw error;
  }
}