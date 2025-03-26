import { NextResponse, NextRequest } from "next/server";
import { getClasses } from "./services/ClassService";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  let tokenExpired = false;
  let tenantDomain: string | undefined = undefined;
  if (
    (currentPath.startsWith("/parent") ||
      currentPath.startsWith("/school_admin"),
    currentPath.startsWith("/student"),
    currentPath.startsWith("/super_admin"),
    currentPath.startsWith("/teacher"))
  ) {
    console.log("currentPath => ", currentPath);

    tenantDomain = request.cookies.get("tenantDomain")?.value;
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!tenantDomain || !accessToken) {
      console.log("No logged in user");
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to login page
    }

    try {
      // cal an API
      const classes = await getClasses(
        `https://${tenantDomain}`,
        accessToken,
        ""
      );
      console.log("Middle classes => ", classes);
    } catch (error) {
      // If there is 401 error set tokenExpired = true
      console.log("Middleware Error => ", error);
      tokenExpired = true;
    }

    if (tokenExpired) {
      console.log("tokenExpired");
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to login page
    }
  }

  return NextResponse.next();
}
