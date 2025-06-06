/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

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

  if (!tenantPrimaryDomain || !tenantPrimaryDomain.startsWith('http')) {
    throw new Error("Invalid tenant domain");
  }

  const url = `${tenantPrimaryDomain}/seatings/arrangement-events/create/`;

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
      const errorDetails = responseData.details
        ? ` Details: ${JSON.stringify(responseData.details)}`
        : '';
      throw new Error(responseData.message || `Request failed with status ${response.status}${errorDetails}`);
    }

    return responseData;
  } catch (error: any) {
    console.error("API call failed:", error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}

export async function updateSeatingArrangement(
  tenantPrimaryDomain: string,
  accessToken: string,
  updates: Array<{seating_id: number, site_number: number}>
) {
  const url = `${tenantPrimaryDomain}/seatings/update-seatings/`;
  if (!accessToken) {
    throw new Error("No access token provided");
  }
  const payload = JSON.stringify({ updates })
  console.log("PAYLOAD",payload)
  
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: payload,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating seating arrangements:", {
      url,
      error: error.message,
      updates,
    });
    throw error;
  }
}

export async function deactivateArrangementEvent(
  tenantPrimaryDomain: string,
  accessToken: string,
  eventId: number
) {
  const url = `${tenantPrimaryDomain}/seatings/deactivate-event/${eventId}/`;
  
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la désactivation de l'événement.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error deactivating event:", {
      url,
      error: error.message,
      eventId,
    });
    throw error;
  }
}

export async function getDeactivatedEvents(
  tenantPrimaryDomain: string,
  accessToken: string
) {
  const url = `${tenantPrimaryDomain}/seatings/deactivated-events/`;
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des événements désactivés.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching deactivated events:", {
      url,
      error: error.message,
    });
    throw error;
  }
}

export async function reactivateArrangementEvent(
  tenantPrimaryDomain: string,
  accessToken: string,
  eventId: number
) {

  console.log("accessToken", accessToken);
  console.log("tenantPrimaryDomain", tenantPrimaryDomain);
  console.log("eventId", eventId)
  if (!accessToken) {
    throw new Error("No access token provided");
  }
  const url = `${tenantPrimaryDomain}/seatings/reactivate-event/${eventId}/`;
  
  try {
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
  } catch (error: any) {
    console.error("Error reactivating event:", {
      url,
      error: error.message,
      eventId,
    });
    throw error;
  }
}