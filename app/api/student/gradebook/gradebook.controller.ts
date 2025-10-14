import { getBackendBaseUrl } from '@/app/utils/constants';
import { getTenantDomain } from '@/app/utils/cookies';
import { StudentGrade } from './gradebook.model';

export async function getGradebookByClassId(request: Request, classId: number, token?: string): Promise<StudentGrade[]> {
  console.log(`Appel de getGradebookByClassId pour la classe ID ${classId}...`);
  const tenantDomain = getTenantDomain(request);
  if (!tenantDomain) throw new Error('Tenant domain not found');
  const backendUrl = getBackendBaseUrl(tenantDomain);
  const response = await fetch(`${backendUrl}/gradebooks/${classId}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log("Réponse brute de l'API (fetch response object) pour gradebook:", response);

  if (!response.ok) {
    console.error("Erreur HTTP pour gradebook:", response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Données reçues (parsed JSON) pour gradebook:", data);

  return data as StudentGrade[];
}
