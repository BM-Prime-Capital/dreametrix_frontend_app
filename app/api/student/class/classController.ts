import { getBackendBaseUrl } from '@/app/utils/constants';
import { getTenantDomain } from '@/app/utils/cookies';


export async function getAllClasses(request: Request, token?: string) {
  const tenantDomain = getTenantDomain(request);
  if (!tenantDomain) throw new Error('Tenant domain not found');
  const backendUrl = getBackendBaseUrl(tenantDomain);
  const response = await fetch(`${backendUrl}/classes/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: data, status: response.status };
}


export async function getClassById(request: Request, id: number, token?: string) {
  const tenantDomain = getTenantDomain(request);
  if (!tenantDomain) throw new Error('Tenant domain not found');
  const backendUrl = getBackendBaseUrl(tenantDomain);
  const response = await fetch(`${backendUrl}/classes/${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: data, status: response.status };
}
