import { getBackendBaseUrl } from "@/app/utils/constants";
import { getTenantDomain } from "@/app/utils/cookies";

export async function getAssignments(request: Request, token?: string) {
  const tenantDomain = getTenantDomain(request);
  if (!tenantDomain) throw new Error('Tenant domain not found');
  const backendUrl = getBackendBaseUrl(tenantDomain);
  const response = await fetch(`${backendUrl}/assessments`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data: data, status: response.status };
}
