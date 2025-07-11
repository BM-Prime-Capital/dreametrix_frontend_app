"use server";

export interface Parent {
  id: number;
  user: {
    full_name: string;
    email: string;
    is_active: boolean;
  };
}

export async function fetchParents(
  tenantPrimaryDomain: string,
  accessToken: string,
  page: number
): Promise<Parent[]> {
  if (!tenantPrimaryDomain || !accessToken) {
    throw new Error("Tenant domain and access token are required.");
  }

  const url = new URL(`/parents/?page=${page}`, tenantPrimaryDomain).toString();

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch parents list.");
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

export async function validateParent(
  tenantPrimaryDomain: string,
  accessToken: string,
  id: number
): Promise<void> {
  const url = new URL(`/parents/validate/${id}/`, tenantPrimaryDomain).toString();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to validate parent.");
  }
}

export async function deleteParent(
  tenantPrimaryDomain: string,
  accessToken: string,
  id: number
): Promise<void> {
  const url = new URL(`/parents/${id}/`, tenantPrimaryDomain).toString();
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete parent.");
  }
}
