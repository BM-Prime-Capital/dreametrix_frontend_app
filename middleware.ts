import { NextResponse, NextRequest } from "next/server";
import { getClasses } from "./services/ClassService";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  let tokenExpired = false;
  let tenantDomain: string | undefined = undefined;
  if (
    currentPath.startsWith("/parent") ||
    currentPath.startsWith("/school_admin") ||
    currentPath.startsWith("/student") ||
    currentPath.startsWith("/super_admin") ||
    currentPath.startsWith("/teacher") ||
    currentPath === "/profile"
  ) {
    console.log("currentPath => ", currentPath);

    tenantDomain = request.cookies.get("tenantDomain")?.value;
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!tenantDomain || !accessToken) {
      console.log("No logged in user");
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to login page
    }

    try {
      // Appel léger pour valider le token. En cas d'échec non-401, on NE déconnecte PAS.
      await getClasses(
        `https://${tenantDomain}`,
        accessToken,
        ""
      );
    } catch (error: any) {
      console.log("Middleware Error => ", error);
      const message = typeof error?.message === 'string' ? error.message : '';
      // Ne redirige que si le token est réellement expiré (401)
      if (message.includes("Session expired") || message.includes("401")) {
        console.log("tokenExpired");
        return NextResponse.redirect(new URL("/", request.url)); // Redirect to login page
      }
      // Autres erreurs (403/500 etc.): on laisse l'accès, l'application gèrera l'erreur côté page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/teacher/:path*',
    '/student/:path*', 
    '/parent/:path*',
    '/school_admin/:path*',
    '/super_admin/:path*',
    '/profile'
  ],
}
