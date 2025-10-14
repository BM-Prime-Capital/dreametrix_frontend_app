import { getBackendBaseUrl } from '@/app/utils/constants';
import { getTenantDomain } from '@/app/utils/cookies';
import { Student, StudentApiResponse } from './student.model';

export async function getAuthenticatedStudent(request: Request, token?: string): Promise<Student | null> {
  console.log("Appel de getAuthenticatedStudent...");
  const tenantDomain = getTenantDomain(request);
  if (!tenantDomain) {
    throw new Error('Tenant domain not found');
  }
  const backendUrl = getBackendBaseUrl(tenantDomain);
  const response = await fetch(`${backendUrl}/students/`, {
    headers: { Authorization: `Bearer ${token}`}
  });

  console.log("Réponse brute de l'API (fetch response object) pour student:", response);

  if (!response.ok) {
    console.error("Erreur HTTP pour student:", response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const apiResponse: StudentApiResponse = await response.json();
  console.log("Données reçues (parsed JSON) pour student:", apiResponse);

  // Assuming the API returns an array with a single student object for the authenticated user
  if (apiResponse.results && apiResponse.results.length > 0) {
    return apiResponse.results[0];
  } else {
    console.warn("Aucun étudiant trouvé dans la réponse pour l'utilisateur authentifié.");
    return null;
  }
}
