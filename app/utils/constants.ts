/**
 * Get the backend base URL dynamically using the tenant domain
 * This function is primarily for API routes that extract tenant domain from cookies
 * @param tenantDomain - The tenant's primary domain (e.g., "josue-school")
 * @returns The full backend URL for the tenant
 * @throws Error if tenantDomain is not provided
 */
export function getBackendBaseUrl(tenantDomain: string): string {
  if (!tenantDomain) {
    throw new Error('Tenant domain is required to construct backend URL');
  }
  return tenantDomain.startsWith('https://') ? tenantDomain : `https://${tenantDomain}`;
}