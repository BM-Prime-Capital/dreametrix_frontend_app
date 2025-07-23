"use server";

import { redirect } from "next/navigation";

export async function getSubjects(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/digital_library/subjects/`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux donnees.");
    } else {
      throw new Error("Erreur lors de la récupération des donnees.");
    }
  }

  const data = await response.json();

  return data.subjects;
}

// export async function getGrades(
//   subject: string,
//   tenantPrimaryDomain: string,
//   accessToken: string,
//   refreshToken: string
// ) {

//   if (!accessToken) {
//     throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
//   }
//   const url = `${tenantPrimaryDomain}/digital_library/grades/${subject}`;

//   // Add logging to verify your tokens
//   console.log('Access Token:', accessToken);
//   console.log('Refresh Token:', refreshToken);
//   console.log('Request URL:', url);

//   // Try adding error handling for the fetch call
//   try {
//     let response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       // Log more details about the failed response
//       console.error('Response status:', response.status);
//       console.error('Response text:', await response.text());

//       if (response.status === 403) {
//         throw new Error("Vous n'avez pas la permission d'accéder aux donnees.");
//       } else {
//         throw new Error(`Erreur lors de la récupération des donnees. Status: ${response.status}`);
//       }
//     }

//     const data = await response.json();
//     return data.grades;
//   } catch (error) {
//     console.error('Fetch error:', error);
//     throw error;
//   }
// }

export async function getGrades(
  subject: string,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  try {
    const url = `${tenantPrimaryDomain}/digital_library/grades/${subject}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Retourner les grades par défaut si l'endpoint n'existe pas
        // return ["3", "4", "5", "6", "7", "8"];
        return null;
      }
      throw new Error(
        `Erreur ${response.status} lors de la récupération des grades`
      );
    }

    const data = await response.json();
    // return data.grades || ["3", "4", "5", "6", "7", "8"];
    return data.grades;
  } catch (error) {
    console.error("Error fetching grades:", error);
    // Retourner les grades par défaut en cas d'erreur
    // return ["3", "4", "5", "6", "7", "8"];
    return null;
  }
}

export async function getDomains(
  { subject, grade }: { subject: string; grade: number },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/digital_library/domains/${subject}/${grade}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      return [];
    } else {
      return [];
    }
  }

  const data = await response.json();

  return data.domains;
}

export async function getStandards(
  {
    subject,
    grade,
    domain,
  }: { subject: string; grade: number; domain: string },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/digital_library/standards/${subject}/${grade}/${domain}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux donnees.");
    } else {
      throw new Error("Erreur lors de la récupération des donnees.");
    }
  }

  const data = await response.json();

  return data.standards;
}

export async function getQuestionsLinks(
  {
    subject,
    grade,
    domain,
    questionsType,
    standards,
  }: {
    subject: string;
    grade: string;
    domain: string;
    questionsType: string;
    standards: string[];
  },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/digital_library/links/${subject}/${grade}/${domain}/${standards.join(
    ","
  )}/${questionsType}/`;

  console.log("URL DATA => ", url);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      return redirect("/");
    } else if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux donnees.");
    } else {
      throw new Error("Erreur lors de la récupération des donnees.");
    }
  }

  const data = await response.json();

  return data;
}
