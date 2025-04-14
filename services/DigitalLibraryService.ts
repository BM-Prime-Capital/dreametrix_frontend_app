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
    if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux donnees.");
    } else {
      throw new Error("Erreur lors de la récupération des donnees.");
    }
  }

  const data = await response.json();

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
    if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder aux donnees.");
    } else {
      throw new Error("Erreur lors de la récupération des donnees.");
    }
  }

  const data = await response.json();

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
  let response = await fetch(url, {
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
  let response = await fetch(url, {
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
