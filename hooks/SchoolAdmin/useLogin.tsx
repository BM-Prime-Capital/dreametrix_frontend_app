"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { localStorageKey } from "@/constants/global";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/userSlice";

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  role: string;
  email: string;
  username: string;
  owner_id?: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

interface Tenant {
  name: string;
  code: string;
  primary_domain: string;
}

interface LoginResponse {
  refresh: string;
  access: string;
  user: User;
  tenant: Tenant;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-dreametrix.com"}/accounts/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      const userData: User = {
        id: data.user.id,
        owner_id: data.user.owner_id,
        role: data.user.role,
        email: data.user.email,
        username: data.user.username,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        full_name: data.user.first_name
          ? `${data.user.first_name} ${data.user.last_name}`
          : data.user.username,
      };

      const tenantData: Tenant = {
        name: data.tenant.name,
        code: data.tenant.code,
        primary_domain: data.tenant.primary_domain,
      };

      // --- Stockage local
      localStorage.setItem(localStorageKey.ACCESS_TOKEN, data.access);
      localStorage.setItem(localStorageKey.REFRESH_TOKEN, data.refresh);
      localStorage.setItem(localStorageKey.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(localStorageKey.TENANT_DATA, JSON.stringify(tenantData));

      // --- First login detection
      const hasLoggedInBeforeKey = `has_logged_in_before_${userData.id}`;
      const hasLoggedInBefore = localStorage.getItem(hasLoggedInBeforeKey) === 'true';
      
      if (!hasLoggedInBefore) {
        localStorage.setItem(hasLoggedInBeforeKey, 'true');
      }

      // --- Cookies pour middleware
      Cookies.set("tenantDomain", data.tenant.primary_domain, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      Cookies.set(localStorageKey.ACCESS_TOKEN, data.access, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      Cookies.set(localStorageKey.TENANT_DATA, JSON.stringify(tenantData), {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      Cookies.set(localStorageKey.USER_DATA, JSON.stringify(userData), {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // --- Redux
      dispatch(loginSuccess({ user: userData, tenant: tenantData, token: data.access, schoolData: data.tenant }));

      // --- Redirection en fonction du rôle
      switch (data.user.role) {
        
        case "school_admin":
          router.push("/school_admin");
          break;
        case "teacher":
          router.push("/teacher");
          break;
        case "student":
          router.push("/student");
          break;
        case "parent":
          router.push("/parent");
          break;
        case "superadmin":
          router.push("/super_admin");
          break;
        default:
          router.push("/super_admin/schools");
          //router.push("/dashboard");
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
