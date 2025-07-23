"use server";

const characterPath = "/characters/initialize-class/";

export async function getCharracters(
  initCharaterData: { class_id: number; teacher_id: number; date?: string },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  // Use provided date or current date
  const requestDate =
    initCharaterData.date || new Date().toISOString().split("T")[0];
  const requestData = {
    class_id: initCharaterData.class_id,
    teacher_id: initCharaterData.teacher_id,
    date: requestDate,
  };

  console.log("initCharaterData => ", requestData);
  const url = `${tenantPrimaryDomain}${characterPath}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestData),
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

  return data.characters;
}

export async function updateCharacter(
  character: any,
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  try {
    const url = `${tenantPrimaryDomain}/characters/update-ratings/`;
    console.log("URL => ", url);

    // Ensure character data includes date information
    const characterData = {
      ...character,
      observation_date:
        character.observation_date || new Date().toISOString().split("T")[0],
    };

    const data = {
      updates: [characterData],
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData: any = await response.json();
      console.log("PUT Character data => ", responseData);
      return "ok";
    } else {
      console.log("PUT Character Failed => ", response);
      throw new Error("Character modification failed");
    }
  } catch (error) {
    console.log("Error => ", error);
    throw error;
  }
}

export async function getCharractersList(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/characters/public-characters/`;
  const response = await fetch(url, {
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

export async function getCharacterGeneralView(
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }
  const url = `${tenantPrimaryDomain}/characters/character-general-view`;
  const response = await fetch(url, {
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
  console.log("characters_general_view => ", data);

  return data;
}

// Get character observations for a specific date range
export async function getCharacterObservationsForDateRange(
  params: {
    class_id: number;
    teacher_id: number;
    start_date: string;
    end_date: string;
  },
  tenantPrimaryDomain: string,
  accessToken: string,
  refreshToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${tenantPrimaryDomain}/characters/date-range/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "Vous n'avez pas la permission d'accéder aux observations."
      );
    } else {
      throw new Error("Erreur lors de la récupération des observations.");
    }
  }

  const data = await response.json();
  return data.observations;
}
