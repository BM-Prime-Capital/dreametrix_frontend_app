import { localStorageKey } from "@/constants/global";

/**
 * Get the backend base URL from tenant data stored in localStorage
 * This function should be used in client components and "use server" functions
 * @returns The backend URL for the current tenant or throws an error if not found
 */
export function getBackendUrl(): string {
  if (typeof window === 'undefined') {
    throw new Error('getBackendUrl() can only be called from client-side code');
  }

  const tenantDataStr = localStorage.getItem(localStorageKey.TENANT_DATA);
  if (!tenantDataStr) {
    throw new Error('Tenant data not found. Please login again.');
  }

  try {
    const tenantData = JSON.parse(tenantDataStr);
    const primaryDomain = tenantData.primary_domain;

    if (!primaryDomain) {
      throw new Error('Primary domain not found in tenant data. Please login again.');
    }

    return `https://${primaryDomain}`;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid tenant data format. Please login again.');
    }
    throw error;
  }
}

/**
 * Get the backend base URL safely, returning null if tenant data is not available
 * Useful for optional tenant-specific features
 * @returns The backend URL for the current tenant or null if not found
 */
export function getBackendUrlSafe(): string | null {
  try {
    return getBackendUrl();
  } catch {
    return null;
  }
}
