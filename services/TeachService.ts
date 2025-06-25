"use server";

import { redirect } from "next/navigation";

export async function getTeachMaterials(
  tenantPrimaryDomain: string,
  accessToken: string,
  params: {
    material_type?: string;
    subject?: string;
    date?: string;
  } = {}
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = new URL(`${tenantPrimaryDomain}/teach-materials/`);
  
  // Add query parameters
  if (params.material_type) url.searchParams.append('material_type', params.material_type);
  if (params.subject) url.searchParams.append('subject', params.subject);
  if (params.date) url.searchParams.append('date', params.date);

  let response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      tags: ['teach-materials']
    }
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "Vous n'avez pas la permission d'accéder aux ressources pédagogiques."
      );
    } else {
      throw new Error("Erreur lors de la récupération des ressources.");
    }
  }

  const data = await response.json();
  return data;
}

export async function uploadTeachMaterial(
  formData: FormData,
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${tenantPrimaryDomain}/teach-materials/`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Upload failed:", errorData);
      throw new Error(
        errorData.message || "Erreur lors du téléchargement de la ressource."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function downloadTeachMaterial(
  materialId: number,
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${tenantPrimaryDomain}/teach-materials/${materialId}/download/`;
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        "Erreur lors du téléchargement de la ressource."
      );
    }

    return await response.blob();
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}

export async function updateTeachMaterial(
  materialId: number,
  updates: Partial<{
    title: string;
    description: string;
    subject: string;
    associated_date: string;
  }>,
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${tenantPrimaryDomain}/teach-materials/${materialId}/`;
  
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Update failed:", errorData);
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour de la ressource."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

export async function deleteTeachMaterial(
  materialId: number,
  tenantPrimaryDomain: string,
  accessToken: string
) {
  if (!accessToken) {
    throw new Error("Vous n'êtes pas connecté. Veuillez vous reconnecter.");
  }

  const url = `${tenantPrimaryDomain}/teach-materials/${materialId}/`;
  
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la suppression de la ressource."
      );
    }

    return true;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}