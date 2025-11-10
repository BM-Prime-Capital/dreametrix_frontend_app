/**
 * Parse cookies from a Request object
 */
function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split('=');
    cookies[name] = decodeURIComponent(value);
    return cookies;
  }, {} as Record<string, string>);
}

/**
 * Get the tenant domain from request cookies
 * @param request - The Next.js Request object
 * @returns The tenant domain string or null if not found
 */
export function getTenantDomain(request: Request): string | null {
  const cookies = parseCookies(request);
  return cookies['tenantDomain'] || null;
}

/**
 * Get the access token from request cookies
 * @param request - The Next.js Request object
 * @returns The access token string or null if not found
 */
export function getAccessToken(request: Request): string | null {
  const cookies = parseCookies(request);
  return cookies['accessToken'] || null;
}

/**
 * Get tenant data from request cookies
 * @param request - The Next.js Request object
 * @returns The parsed tenant data object or null if not found
 */
export function getTenantData(request: Request): any | null {
  const cookies = parseCookies(request);
  const tenantDataStr = cookies['tenantData'];
  if (!tenantDataStr) return null;

  try {
    return JSON.parse(tenantDataStr);
  } catch {
    return null;
  }
}
