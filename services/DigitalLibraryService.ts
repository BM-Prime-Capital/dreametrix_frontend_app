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

  console.log("Subjects => ", data); // Subjects =>  { subjects: [ 'Math', 'Language' ] }

  return data.subjects;
}

export async function getGrades(
  subject: string,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/digital_library/grades/${subject}`;
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

  console.log("Grades => ", data);

  return data.grades;
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

  console.log("Domains => ", data);

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

  console.log("Standanrds => ", data);

  return data.standards;
}

export async function createDigitalLibrarySheet(
  digitalLibrary: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const url = `${tenantPrimaryDomain}/digital_library/generate-pdf/`;
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(digitalLibrary),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      console.log("POST DigitalLibrary data => ", url);

      return url;
    } else {
      console.log("POST DigitalLibrary Failed => ", response);
      if (response.status == 401) {
        return redirect("/");
      } else {
        throw new Error("DigitalLibrary creation failed");
      }
    }
  } catch (error) {
    console.log("Error => ", error);
  }
  return null;
}
