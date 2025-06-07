
import { MenuRoute } from "@/types";

export function isMenuItemActive(route: MenuRoute, pathname: string): boolean {
    // Exact match required
    if (route.exact) {
        return pathname === route.path;
    }

    // Special case: root route "/"
    if (route.path === "/") {
        return pathname === "/";
    }

    // Default behavior: match the path or any sub path
    return pathname === route.path || pathname.startsWith(route.path + "/");
}
