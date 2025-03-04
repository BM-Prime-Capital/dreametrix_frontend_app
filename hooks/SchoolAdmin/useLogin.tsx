"use client"

import { useState } from "react"

interface LoginCredentials {
  email: string
  password: string
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        redirect: "follow", // This allows the browser to follow redirects
      })

      if (response.ok) {
        // The backend will handle the redirect, so we don't need to do anything here
        // The browser will automatically follow the redirect
        return true
      } else {
        // If the response is not ok, we'll assume it's an error
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

