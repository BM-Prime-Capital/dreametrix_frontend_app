"use server";

//import { redirect } from "next/navigation";

export async function getSeatingArrangements(
  tenantPrimaryDomain: string,
  accessToken: string,
  courseId?: number
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = courseId 
    ? `${tenantPrimaryDomain}/seatings/seating-arrangements/?course_id=${courseId}`
    : `${tenantPrimaryDomain}/seatings/seating-arrangements/`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Vous n'avez pas la permission d'accéder à ces données.");
    } else {
      throw new Error("Erreur lors de la récupération des données.");
    }
  }

  return await response.json();
}

export async function createArrangementEvent(
  tenantPrimaryDomain: string,
  accessToken: string,
  data: {
    name: string;
    course: number;
    teacher: number;
  }
) {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  // Vérifier que l'URL est valide
  if (!tenantPrimaryDomain || !tenantPrimaryDomain.startsWith('http')) {
    throw new Error("Invalid tenant domain");
  }

  const url = `${tenantPrimaryDomain}/seatings/arrangement-events/create/`;

  // Log the data to ensure it's correct
  console.log("Data to be sent:", data);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Ajouter les détails de l'erreur si disponibles
      const errorDetails = responseData.details
        ? ` Details: ${JSON.stringify(responseData.details)}`
        : '';

      throw new Error(responseData.message || `Request failed with status ${response.status}${errorDetails}`);
    }

    return responseData;
  } catch (error: any) {
    console.error("API call failed:", {
      url,
      error: error.message,
      data,
    });

    // Améliorer le message d'erreur pour les problèmes réseau
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Network error. Please check your connection.");
    }

    throw error;
  }
}

export async function updateSeatingArrangement(
  tenantPrimaryDomain: string,
  accessToken: string,
  seatingId: number,
  siteNumber: number
) {
  const url = `${tenantPrimaryDomain}/seatings/update-seating/${seatingId}/`;
  console.log("tenantPrimaryDomain", tenantPrimaryDomain);
  console.log("accessToken", accessToken)
  console.log("seatingId", seatingId)
  console.log("siteNumber", siteNumber)
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ site_number: siteNumber }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

export async function deactivateArrangementEvent(
  tenantPrimaryDomain: string,
  accessToken: string,
  eventId: number
) {
  const url = `${tenantPrimaryDomain}/seatings/deactivate-event/${eventId}/`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la désactivation de l'événement.");
  }

  return await response.json();
}

export async function getDeactivatedEvents(
  tenantPrimaryDomain: string,
  accessToken: string
) {
  const url = `${tenantPrimaryDomain}/seatings/deactivated-events/`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des événements désactivés.");
  }

  return await response.json();
}

export async function reactivateArrangementEvent(
  tenantPrimaryDomain: string,
  accessToken: string,
  eventId: number
) {
  const url = `${tenantPrimaryDomain}/seatings/reactivate-event/${eventId}/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la réactivation de l'événement.");
  }

  return await response.json();
}