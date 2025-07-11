"use server";

/**
 * Représente un utilisateur parent
 */
export interface Parent {
  id: number;
  user: {
    full_name: string;
    email: string;
    is_active: boolean;
  };
}

/**
 * Représente une demande de déliaison parent-élève
 */
export interface UnlinkRequest {
  id: number;
  student_name: string;
  parent_name: string;
  requested_at: string;
}

/**
 * Récupère la liste des parents
 */
export async function fetchParents(
  tenantPrimaryDomain: string,
  accessToken: string
): Promise<Parent[]> {
  const url = new URL("/parents/", tenantPrimaryDomain).toString();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorData = await safeParseJSON(response);
    throw new Error(errorData?.message || "Erreur lors de la récupération des parents.");
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

/**
 * Récupère les demandes de déliaison
 */
export async function fetchUnlinkRequests(
  tenantPrimaryDomain: string,
  accessToken: string
): Promise<UnlinkRequest[]> {
  const url = new URL("/admin/unlink_requests/", tenantPrimaryDomain).toString();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorData = await safeParseJSON(response);
    throw new Error(errorData?.message || "Erreur lors de la récupération des demandes.");
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

/**
 * Valide un parent
 */
export async function validateParent(
  tenantPrimaryDomain: string,
  accessToken: string,
  parentId: number
): Promise<void> {
  const url = new URL(`/parents/validate/${parentId}/`, tenantPrimaryDomain).toString();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorData = await safeParseJSON(response);
    throw new Error(errorData?.message || `Échec de la validation du parent ${parentId}.`);
  }
}

/**
 * Supprime un parent
 */
export async function deleteParent(
  tenantPrimaryDomain: string,
  accessToken: string,
  parentId: number
): Promise<void> {
  const url = new URL(`/parents/${parentId}/`, tenantPrimaryDomain).toString();

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorData = await safeParseJSON(response);
    throw new Error(errorData?.message || `Échec de la suppression du parent ${parentId}.`);
  }
}

/**
 * Approuve une demande de déliaison
 */
export async function approveUnlink(
  tenantPrimaryDomain: string,
  accessToken: string,
  requestId: number
): Promise<void> {
  const url = new URL(`/admin/unlink_requests/${requestId}/approve/`, tenantPrimaryDomain).toString();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const errorData = await safeParseJSON(response);
    throw new Error(errorData?.message || `Échec de l’approbation de la demande ${requestId}.`);
  }
}

// Helper pour éviter les crashs en JSON.parse
async function safeParseJSON(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
