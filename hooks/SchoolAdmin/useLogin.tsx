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
    role: string
    // other user properties...
  }
  tenant: {
    name: string
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

        // Store tokens in localStorage (consider using a more secure method in production)
        localStorage.setItem("accessToken", data.access)
        localStorage.setItem("refreshToken", data.refresh)

        // Redirect based on user role
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

