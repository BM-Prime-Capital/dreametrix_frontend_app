"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  refresh: string
  access: string
  user: {
    id: number
    role: string
    email: string
    username: string
    // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
  }
  tenant: {
    name: string
    code: string
    primary_domain: string
  }
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://backend-dreametrix.com/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        const data: LoginResponse = await response.json()

        // Stocker les tokens
        localStorage.setItem("accessToken", data.access)
        localStorage.setItem("refreshToken", data.refresh)

        // Stocker les informations de l'utilisateur
        localStorage.setItem(
          "userData",
          JSON.stringify({
            id: data.user.id,
            role: data.user.role,
            email: data.user.email,
            username: data.user.username,
           
            // Ajoutez d'autres propriétés si nécessaire
          }),
        )

        // Stocker les informations du tenant
        localStorage.setItem(
          "tenantData",
          JSON.stringify({
            name: data.tenant.name,
            code: data.tenant.code,
            primary_domain: data.tenant.primary_domain,
          }),
        )

        // Redirection basée sur le rôle de l'utilisateur
        switch (data.user.role) {
          case "school_admin":
            router.push("/school_admin")
            break
          case "teacher":
            router.push("/teacher")
            break
          case "student":
            router.push("/student")
            break
          case "parent":
            router.push("/parent")
            break
          case "superadmin":
            router.push("/superadmin")
            break
          default:
            router.push("/dashboard")
        }

        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}

